# Kubernetes Deployment Guide for SOW Template Service

This guide covers deploying the SOW Template Service on Kubernetes (k8s) or k3s with GPU support for AMD and Nvidia graphics cards, including security best practices.

## 📋 Prerequisites

### **Kubernetes Cluster Requirements**

- Kubernetes 1.24+ or k3s 1.24+
- Container runtime with GPU support (containerd/CRI-O)
- NVIDIA Container Toolkit (for Nvidia GPUs)
- ROCm drivers (for AMD GPUs)
- Persistent storage support
- Ingress controller (recommended: Traefik, Nginx, or Istio)

### **GPU Support Setup**

#### **NVIDIA GPU Support**

```bash
# Install NVIDIA Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

# Configure containerd
sudo nvidia-ctk runtime configure --runtime=containerd
sudo systemctl restart containerd

# Install NVIDIA Device Plugin for Kubernetes
kubectl apply -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v0.14.1/nvidia-device-plugin.yml
```

#### **AMD GPU Support**

```bash
# Install ROCm drivers (Ubuntu/Debian)
wget -q -O - https://repo.radeon.com/rocm/rocm.gpg.key | sudo apt-key add -
echo 'deb [arch=amd64] https://repo.radeon.com/rocm/apt/5.4.3 jammy main' | sudo tee /etc/apt/sources.list.d/rocm.list
sudo apt update
sudo apt install rocm-dev rocm-libs

# Install AMD Device Plugin for Kubernetes
kubectl apply -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/master/k8s-ds-amdgpu-dp.yaml
```

## 🚀 Deployment Configurations

### **1. Namespace and Security Setup**

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: sow-template-service
  labels:
    name: sow-template-service
    security-policy: restricted
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: sow-service-account
  namespace: sow-template-service
automountServiceAccountToken: false
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: sow-template-service
  name: sow-service-role
rules:
- apiGroups: [""]
  resources: ["pods", "configmaps", "secrets"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: sow-service-rolebinding
  namespace: sow-template-service
subjects:
- kind: ServiceAccount
  name: sow-service-account
  namespace: sow-template-service
roleRef:
  kind: Role
  name: sow-service-role
  apiGroup: rbac.authorization.k8s.io
```

### **2. ConfigMaps and Secrets**

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: sow-config
  namespace: sow-template-service
data:
  BACKEND_PORT: "4000"
  FRONTEND_PORT: "3000"
  OLLAMA_URL: "http://ollama-service:11434"
  OLLAMA_MODEL: "llama3"
  NODE_ENV: "production"
---
apiVersion: v1
kind: Secret
metadata:
  name: sow-secrets
  namespace: sow-template-service
type: Opaque
data:
  # Base64 encoded values
  API_KEY: ""  # Add your API keys here
  JWT_SECRET: ""  # Add JWT secret for authentication
```

### **3. Persistent Storage**

```yaml
# storage.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: sow-uploads-pvc
  namespace: sow-template-service
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd  # Adjust based on your storage class
  resources:
    requests:
      storage: 10Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ollama-models-pvc
  namespace: sow-template-service
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 50Gi  # Large enough for AI models
```

### **4. Backend Deployment**

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sow-backend
  namespace: sow-template-service
  labels:
    app: sow-backend
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sow-backend
  template:
    metadata:
      labels:
        app: sow-backend
        tier: backend
    spec:
      serviceAccountName: sow-service-account
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
      containers:
      - name: backend
        image: sow-backend:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 4000
          name: http
        envFrom:
        - configMapRef:
            name: sow-config
        - secretRef:
            name: sow-secrets
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          runAsUser: 1000
          capabilities:
            drop:
            - ALL
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        volumeMounts:
        - name: uploads
          mountPath: /app/uploads
        - name: tmp
          mountPath: /tmp
        readinessProbe:
          httpGet:
            path: /api/health
            port: 4000
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /api/health
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
      volumes:
      - name: uploads
        persistentVolumeClaim:
          claimName: sow-uploads-pvc
      - name: tmp
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: sow-backend-service
  namespace: sow-template-service
spec:
  selector:
    app: sow-backend
  ports:
  - name: http
    port: 4000
    targetPort: 4000
  type: ClusterIP
```

### **5. Frontend Deployment**

```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sow-frontend
  namespace: sow-template-service
  labels:
    app: sow-frontend
    tier: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sow-frontend
  template:
    metadata:
      labels:
        app: sow-frontend
        tier: frontend
    spec:
      serviceAccountName: sow-service-account
      securityContext:
        runAsNonRoot: true
        runAsUser: 101  # nginx user
        runAsGroup: 101
        fsGroup: 101
      containers:
      - name: frontend
        image: sow-frontend:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
          name: http
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          runAsUser: 101
          capabilities:
            drop:
            - ALL
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /var/cache/nginx
        - name: run
          mountPath: /var/run
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 15
          periodSeconds: 10
      volumes:
      - name: tmp
        emptyDir: {}
      - name: cache
        emptyDir: {}
      - name: run
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: sow-frontend-service
  namespace: sow-template-service
spec:
  selector:
    app: sow-frontend
  ports:
  - name: http
    port: 80
    targetPort: 80
  type: ClusterIP
```

### **6. Ollama Deployment with GPU Support**

#### **NVIDIA GPU Configuration**

```yaml
# ollama-nvidia-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ollama-nvidia
  namespace: sow-template-service
  labels:
    app: ollama
    gpu-type: nvidia
spec:
  replicas: 1  # Single instance for GPU workload
  selector:
    matchLabels:
      app: ollama
      gpu-type: nvidia
  template:
    metadata:
      labels:
        app: ollama
        gpu-type: nvidia
    spec:
      serviceAccountName: sow-service-account
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
      containers:
      - name: ollama
        image: ollama-nvidia:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 11434
          name: http
        env:
        - name: OLLAMA_HOST
          value: "0.0.0.0:11434"
        - name: OLLAMA_MODELS
          value: "/models"
        - name: NVIDIA_VISIBLE_DEVICES
          value: "all"
        - name: NVIDIA_DRIVER_CAPABILITIES
          value: "compute,utility"
        securityContext:
          allowPrivilegeEscalation: false
          runAsNonRoot: true
          runAsUser: 1000
          capabilities:
            drop:
            - ALL
        resources:
          requests:
            memory: "4Gi"
            cpu: "1000m"
            nvidia.com/gpu: 1
          limits:
            memory: "16Gi"
            cpu: "4000m"
            nvidia.com/gpu: 1
        volumeMounts:
        - name: models
          mountPath: /models
        - name: tmp
          mountPath: /tmp
        readinessProbe:
          httpGet:
            path: /api/tags
            port: 11434
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /api/tags
            port: 11434
          initialDelaySeconds: 60
          periodSeconds: 20
      volumes:
      - name: models
        persistentVolumeClaim:
          claimName: ollama-models-pvc
      - name: tmp
        emptyDir: {}
      nodeSelector:
        nvidia.com/gpu.present: "true"
      tolerations:
      - key: nvidia.com/gpu
        operator: Exists
        effect: NoSchedule
```

#### **AMD GPU Configuration**

```yaml
# ollama-amd-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ollama-amd
  namespace: sow-template-service
  labels:
    app: ollama
    gpu-type: amd
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ollama
      gpu-type: amd
  template:
    metadata:
      labels:
        app: ollama
        gpu-type: amd
    spec:
      serviceAccountName: sow-service-account
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
      containers:
      - name: ollama
        image: ollama-amd:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 11434
          name: http
        env:
        - name: OLLAMA_HOST
          value: "0.0.0.0:11434"
        - name: OLLAMA_MODELS
          value: "/models"
        - name: HIP_VISIBLE_DEVICES
          value: "all"
        - name: ROC_ENABLE_PRE_VEGA
          value: "1"
        securityContext:
          allowPrivilegeEscalation: false
          runAsNonRoot: true
          runAsUser: 1000
          capabilities:
            drop:
            - ALL
        resources:
          requests:
            memory: "4Gi"
            cpu: "1000m"
            amd.com/gpu: 1
          limits:
            memory: "16Gi"
            cpu: "4000m"
            amd.com/gpu: 1
        volumeMounts:
        - name: models
          mountPath: /models
        - name: tmp
          mountPath: /tmp
        readinessProbe:
          httpGet:
            path: /api/tags
            port: 11434
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /api/tags
            port: 11434
          initialDelaySeconds: 60
          periodSeconds: 20
      volumes:
      - name: models
        persistentVolumeClaim:
          claimName: ollama-models-pvc
      - name: tmp
        emptyDir: {}
      nodeSelector:
        amd.com/gpu.present: "true"
      tolerations:
      - key: amd.com/gpu
        operator: Exists
        effect: NoSchedule
```

#### **Ollama Service**

```yaml
# ollama-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: ollama-service
  namespace: sow-template-service
spec:
  selector:
    app: ollama
  ports:
  - name: http
    port: 11434
    targetPort: 11434
  type: ClusterIP
```

### **7. Ingress Configuration**

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: sow-template-ingress
  namespace: sow-template-service
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/client-max-body-size: "50m"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
spec:
  tls:
  - hosts:
    - sow.yourdomain.com
    secretName: sow-tls-secret
  rules:
  - host: sow.yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: sow-backend-service
            port:
              number: 4000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: sow-frontend-service
            port:
              number: 80
```

### **8. Network Policy (Security)**

```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: sow-network-policy
  namespace: sow-template-service
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-controller
    ports:
    - protocol: TCP
      port: 80
    - protocol: TCP
      port: 4000
  - from:
    - podSelector:
        matchLabels:
          app: sow-backend
    - podSelector:
        matchLabels:
          app: sow-frontend
    ports:
    - protocol: TCP
      port: 11434
  egress:
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
  - to:
    - podSelector:
        matchLabels:
          app: ollama
    ports:
    - protocol: TCP
      port: 11434
```

## 🔧 Deployment Commands

### **Step-by-Step Deployment**

```bash
# 1. Create namespace and RBAC
kubectl apply -f namespace.yaml

# 2. Create storage
kubectl apply -f storage.yaml

# 3. Create configuration
kubectl apply -f configmap.yaml

# 4. Deploy backend
kubectl apply -f backend-deployment.yaml

# 5. Deploy frontend
kubectl apply -f frontend-deployment.yaml

# 6. Deploy Ollama (choose GPU type)
# For NVIDIA:
kubectl apply -f ollama-nvidia-deployment.yaml
# For AMD:
kubectl apply -f ollama-amd-deployment.yaml

# 7. Create Ollama service
kubectl apply -f ollama-service.yaml

# 8. Setup ingress
kubectl apply -f ingress.yaml

# 9. Apply network security
kubectl apply -f network-policy.yaml
```

### **Using Justfile for Deployment**

Add to your existing Justfile:

```bash
# Kubernetes deployment commands
k8s-deploy-all:
    kubectl apply -f deployment/namespace.yaml
    kubectl apply -f deployment/storage.yaml
    kubectl apply -f deployment/configmap.yaml
    kubectl apply -f deployment/backend-deployment.yaml
    kubectl apply -f deployment/frontend-deployment.yaml
    kubectl apply -f deployment/ollama-service.yaml

k8s-deploy-nvidia:
    kubectl apply -f deployment/ollama-nvidia-deployment.yaml

k8s-deploy-amd:
    kubectl apply -f deployment/ollama-amd-deployment.yaml

k8s-deploy-security:
    kubectl apply -f deployment/ingress.yaml
    kubectl apply -f deployment/network-policy.yaml

k8s-status:
    kubectl get all -n sow-template-service

k8s-logs-backend:
    kubectl logs -f deployment/sow-backend -n sow-template-service

k8s-logs-ollama:
    kubectl logs -f deployment/ollama-nvidia -n sow-template-service
    # or
    kubectl logs -f deployment/ollama-amd -n sow-template-service

k8s-cleanup:
    kubectl delete namespace sow-template-service
```

## 🔒 Security Best Practices

### **Pod Security Standards**

```yaml
# pod-security-policy.yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: sow-limits
  namespace: sow-template-service
spec:
  limits:
  - default:
      memory: "512Mi"
      cpu: "500m"
    defaultRequest:
      memory: "256Mi"
      cpu: "250m"
    type: Container
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: sow-quota
  namespace: sow-template-service
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    nvidia.com/gpu: "2"
    amd.com/gpu: "2"
```

### **Security Scanning and Monitoring**

```bash
# Scan container images for vulnerabilities
trivy image sow-backend:latest
trivy image sow-frontend:latest
trivy image ollama-nvidia:latest

# Monitor security events
kubectl get events -n sow-template-service --sort-by=.metadata.creationTimestamp

# Check pod security compliance
kubectl auth can-i --list --as=system:serviceaccount:sow-template-service:sow-service-account
```

## 📊 Monitoring and Observability

### **Prometheus Monitoring**

```yaml
# monitoring.yaml
apiVersion: v1
kind: Service
metadata:
  name: sow-backend-metrics
  namespace: sow-template-service
  labels:
    app: sow-backend
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "4000"
    prometheus.io/path: "/metrics"
spec:
  selector:
    app: sow-backend
  ports:
  - name: metrics
    port: 4000
```

### **Health Checks and Scaling**

```bash
# Check deployment status
kubectl get deployment -n sow-template-service

# Scale deployments
kubectl scale deployment sow-backend --replicas=3 -n sow-template-service
kubectl scale deployment sow-frontend --replicas=3 -n sow-template-service

# Auto-scaling (HPA)
kubectl autoscale deployment sow-backend --cpu-percent=70 --min=2 --max=10 -n sow-template-service
```

## 🚨 Troubleshooting

### **Common Issues**

1. **GPU Not Detected**

```bash
# Check GPU availability
kubectl describe node | grep -A5 "Allocatable:"
kubectl get nodes -o json | jq '.items[].status.allocatable'

# Verify device plugins
kubectl get pods -n kube-system | grep device-plugin
```

2. **Ollama Connection Issues**

```bash
# Check Ollama pod logs
kubectl logs -f deployment/ollama-nvidia -n sow-template-service

# Test Ollama connectivity
kubectl exec -it deployment/sow-backend -n sow-template-service -- curl http://ollama-service:11434/api/tags
```

3. **Storage Issues**

```bash
# Check PVC status
kubectl get pvc -n sow-template-service

# Check storage class
kubectl get storageclass
```

### **Performance Tuning**

```bash
# Monitor resource usage
kubectl top pods -n sow-template-service
kubectl top nodes

# Optimize GPU usage
kubectl describe pod -l app=ollama -n sow-template-service | grep -A10 "Limits:"
```

This comprehensive guide provides enterprise-ready Kubernetes deployment configurations with security, monitoring, and GPU support for both AMD and Nvidia hardware.
