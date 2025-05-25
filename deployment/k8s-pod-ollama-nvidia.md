## 🔑 Key Features of this NVIDIA GPU Deployment

### **NVIDIA GPU Specific Configuration**

- **CUDA 12.4 Support**: Latest CUDA runtime with compute capabilities
- **GPU Device Access**: Proper `/dev/nvidia*` device mounting
- **Memory Management**: Configurable GPU memory fraction (90%)
- **CUDA Optimization**: Cache paths and performance tuning

### **Advanced Features**

- **Model Preloading Job**: Automatic model download and preparation
- **Performance Monitoring**: GPU utilization and memory tracking scripts
- **Larger Storage**: 100GB PVC for NVIDIA model storage
- **Enhanced Security**: Non-root execution with minimal privileges

### **Production Readiness**

- **Health Monitoring**: Comprehensive startup, readiness, and liveness probes
- **Resource Management**: CPU, memory, and GPU limits with auto-scaling
- **Configuration Management**: Centralized config through ConfigMaps
- **Disruption Handling**: Pod Disruption Budget for maintenance

## 🚀 Deployment Commands

```bash
# Deploy NVIDIA GPU Ollama
kubectl apply -f deployment/k8s-pod-ollama-nvidia.yaml

# Check deployment status
kubectl get deployment ollama-nvidia -n sow-template-service

# View logs
kubectl logs -f deployment/ollama-nvidia -n sow-template-service

# Check GPU access
kubectl exec -it deployment/ollama-nvidia -n sow-template-service -- nvidia-smi

# Test Ollama API
kubectl exec -it deployment/ollama-nvidia -n sow-template-service -- curl http://localhost:11434/api/tags

# Run performance benchmark
kubectl exec -it deployment/ollama-nvidia -n sow-template-service -- /etc/ollama/benchmark.sh
```

This deployment provides enterprise-ready NVIDIA GPU support with enhanced performance monitoring, automatic model preloading, and comprehensive resource management for running Ollama in Kubernetes.
