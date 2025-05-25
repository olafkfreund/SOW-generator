# AMD GPU Kubernetes Deployment Guide

This document describes the key features and deployment commands for running Ollama with AMD GPU support on Kubernetes.

## 🔑 Key Features of this AMD GPU Deployment

### **AMD GPU Specific Configuration**
- **ROCm Integration**: Full AMD GPU compute support with ROCm runtime
- **HIP Runtime**: Heterogeneous Interface for Portability (AMD's CUDA equivalent)
- **Device Access**: Proper `/dev/kfd` and `/dev/dri` device mounting
- **GPU Architecture**: Support for RDNA 2/3 (gfx10xx, gfx11xx) architectures

### **Security & Performance**
- **Non-root Execution**: Runs as user 1000 with minimal privileges
- **Resource Limits**: CPU, memory, and GPU resource constraints
- **Health Checks**: Comprehensive startup, readiness, and liveness probes
- **Persistent Storage**: Dedicated volume for AI models (50GB)

### **Production Features**
- **ConfigMap**: Centralized configuration management
- **Service**: ClusterIP service for internal access
- **PDB**: Pod Disruption Budget for maintenance windows
- **HPA**: Horizontal Pod Autoscaler (though limited to 1 replica for GPU)

### **Monitoring & Observability**
- **Prometheus Annotations**: Ready for metrics scraping
- **Detailed Logging**: GPU information scripts in ConfigMap
- **Performance Tuning**: Optimized environment variables for AMD GPUs

## 🚀 Deployment Commands

### Deploy AMD GPU Ollama
```bash
kubectl apply -f deployment/k8s-pod-amd.yaml
```

### Check deployment status
```bash
kubectl get deployment ollama-amd -n sow-template-service
```

### View logs
```bash
kubectl logs -f deployment/ollama-amd -n sow-template-service
```

### Check GPU access
```bash
kubectl exec -it deployment/ollama-amd -n sow-template-service -- rocm-smi
```

### Test Ollama API
```bash
kubectl exec -it deployment/ollama-amd -n sow-template-service -- curl http://localhost:11434/api/tags
```

## 📋 Prerequisites

Before deploying, ensure you have:

1. **AMD GPU Drivers**: ROCm drivers installed on nodes
2. **Device Plugin**: AMD GPU device plugin running in the cluster
3. **Storage Class**: Fast SSD storage class configured
4. **Node Labels**: Nodes properly labeled with `amd.com/gpu.present: "true"`

## 🔧 Troubleshooting

### Common Issues

**GPU Not Detected**:
```bash
# Check GPU visibility in pod
kubectl exec -it deployment/ollama-amd -n sow-template-service -- rocm-smi --showid
```

**Performance Issues**:
```bash
# Monitor resource usage
kubectl top pod -l app=ollama,gpu-type=amd -n sow-template-service
```

**Model Loading Problems**:
```bash
# Check available storage
kubectl exec -it deployment/ollama-amd -n sow-template-service -- df -h /models
```

## 📊 Monitoring

The deployment includes Prometheus annotations for metrics collection:

- **Endpoint**: `http://ollama-amd-service:11434/metrics`
- **Labels**: `app=ollama`, `gpu-type=amd`
- **Namespace**: `sow-template-service`

## 🔄 Updates and Maintenance

### Rolling Updates
```bash
# Update the deployment image
kubectl set image deployment/ollama-amd ollama=ollama-amd:v2.0 -n sow-template-service

# Check rollout status
kubectl rollout status deployment/ollama-amd -n sow-template-service
```

### Backup Models
```bash
# Create backup of model data
kubectl exec deployment/ollama-amd -n sow-template-service -- tar -czf /tmp/models-backup.tar.gz /models
```

This deployment provides enterprise-ready AMD GPU support for running Ollama in Kubernetes with proper security, monitoring, and resource management.
