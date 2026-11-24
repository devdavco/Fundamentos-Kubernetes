# 🧪 Ejemplos Prácticos de la Semana 06: Helm en Acción

Todos los comandos se ejecutan desde la raíz del repositorio (`Fundamentos-Kubernetes`):

```bash
cd Fundamentos-Kubernetes
```

---

## 📑 Índice de Laboratorios

| Lab | Tema | Comandos clave |
| :-: | :--- | :--- |
| **01** | Repositorios y Charts públicos | `helm repo add`, `helm search repo`, `helm show values`, `helm install`, `helm uninstall` |
| **02** | Anatomía de [`kubecafe-chart/`](./kubecafe-chart) | `helm create`, `Chart.yaml`, `values.yaml`, `templates/`, `NOTES.txt` |
| **03** | Validación y múltiples entornos (`dev` vs `prod`) | `helm lint`, `helm template`, `--dry-run --debug`, `-f values-prod.yaml`, `--set` |
| **04** | Ciclo de vida: `upgrade`, `history` y `rollback` | `helm upgrade`, `helm history`, `helm rollback`, `helm get values` |
| **05** | Pruebas automatizadas con `helm test` | `templates/tests/test-connection.yaml`, `helm test <release>` |

---

## 📦 Lab 1: Instalar un Chart desde un Repositorio Oficial
```bash
# 1. Agregar un repositorio de Charts y actualizar índice
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# 2. Buscar Charts y revisar sus valores configurables
helm search repo bitnami/nginx
helm show values bitnami/nginx | head -n 30

# 3. Instalar, listar y limpiar un release de prueba (con --dry-run primero)
helm install demo-nginx bitnami/nginx --dry-run --debug | head -n 40
```

---

## 🏗️ Lab 2: Explora `kubecafe-chart/` y crea tu propio Chart con `helm create`
```bash
# Inspeccionar la estructura del Chart del workshop:
ls -R semana-06-helm/1.ejemplos/kubecafe-chart

# (Opcional) Generar un esqueleto nuevo de práctica en /tmp:
helm create /tmp/mi-primer-chart
```
- **`Chart.yaml`**: nombre, versión SemVer (`version: 0.1.0`) y versión de la app (`appVersion`).
- **`values.yaml`**: variables por defecto (réplicas, imagen, puerto, mensaje).
- **`templates/`**: manifiestos Kubernetes parametrizados con Go templates (`{{ .Values.replicaCount }}`).

---

## 🔍 Lab 3: `helm lint`, `helm template` y Despliegue por Entornos (`dev` vs `prod`)
```bash
# 1. Validar sintaxis del Chart antes de tocar el clúster
helm lint semana-06-helm/1.ejemplos/kubecafe-chart

# 2. Renderizar los YAML en pantalla sin aplicarlos
helm template kubecafe-dev semana-06-helm/1.ejemplos/kubecafe-chart

# 3. Desplegar entorno DEV (valores por defecto)
helm install kubecafe-dev semana-06-helm/1.ejemplos/kubecafe-chart

# 4. Desplegar entorno PROD sobrescribiendo con values-prod.yaml
helm install kubecafe-prod semana-06-helm/1.ejemplos/kubecafe-chart \
  -f semana-06-helm/1.ejemplos/kubecafe-chart/values-prod.yaml

helm list
kubectl get deployments,svc
```

---

## 🔄 Lab 4: `helm upgrade`, `helm history` y `helm rollback`
```bash
# 1. Actualizar el release cambiando réplicas y tag con --set
helm upgrade kubecafe-dev semana-06-helm/1.ejemplos/kubecafe-chart --set replicaCount=3

# 2. Consultar historial de revisiones y valores aplicados
helm history kubecafe-dev
helm get values kubecafe-dev

# 3. Simular un cambio con imagen inexistente y revertir al instante con rollback:
helm upgrade kubecafe-dev semana-06-helm/1.ejemplos/kubecafe-chart --set image.tag=no-existe-999
kubectl get pods -l app.kubernetes.io/instance=kubecafe-dev
helm rollback kubecafe-dev 1
helm history kubecafe-dev
```

---

## 🧪 Lab 5: Pruebas Automatizadas con `helm test`
El archivo [`kubecafe-chart/templates/tests/test-connection.yaml`](./kubecafe-chart/templates/tests/test-connection.yaml) define un Pod con la anotación `"helm.sh/hook": test` que valida la conectividad al `Service`.
```bash
helm test kubecafe-dev --logs
```
> 💡 **Respuesta esperada:** Verás `Phase: Succeeded` y la respuesta HTTP del servicio confirmando que el release responde correctamente.
