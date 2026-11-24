# 🧪 Ejemplos Prácticos de la Semana 05: Operación, Límites y Seguridad

Todos los comandos se ejecutan desde la raíz del repositorio (`Fundamentos-Kubernetes`):

```bash
cd Fundamentos-Kubernetes
```

---

## 📑 Índice de Laboratorios

| Archivo | Concepto Clave | Equivalente en ☕ KubeCafé |
| :--- | :--- | :--- |
| [`01-probes-salud-startup-liveness-readiness.yaml`](./01-probes-salud-startup-liveness-readiness.yaml) | `Startup`, `Readiness` y `Liveness` Probes | Termómetros que verifican si la cafetera ya calentó y si sigue viva. |
| [`02-recursos-limits-oomkilled.yaml`](./02-recursos-limits-oomkilled.yaml) | `requests`, `limits` y `OOMKilled` (`137`) | Tope máximo de agua/energía por mesa para no tumbar el local. |
| [`03-namespace-resourcequota-limitrange.yaml`](./03-namespace-resourcequota-limitrange.yaml) | `Namespace`, `ResourceQuota` y `LimitRange` | Presupuesto total asignado a una sucursal de KubeCafé. |
| [`04-security-context-nonroot.yaml`](./04-security-context-nonroot.yaml) | `SecurityContext` no-root y rootfs `readOnly` | Barista trabajando con equipo de protección y sin llaves maestras. |
| [`05-rbac-serviceaccount-role.yaml`](./05-rbac-serviceaccount-role.yaml) | `ServiceAccount`, `Role` y `RoleBinding` | Carnet de empleado con permiso solo para consultar pedidos, no borrarlos. |
| [`06-networkpolicy-aislamiento.yaml`](./06-networkpolicy-aislamiento.yaml) | `NetworkPolicy` (Pod-a-Pod con Cilium) | Puerta de acceso a la caja fuerte: solo entra el Backend autorizado. |

---

## 🌡️ Lab 1: Sondas de Salud (`Startup`, `Readiness` y `Liveness`)
```bash
kubectl apply -f semana-05-operacion-seguridad/1.ejemplos/01-probes-salud-startup-liveness-readiness.yaml
kubectl wait --for=condition=ready pod -l app=cafetera-probes --timeout=90s
kubectl describe pod -l app=cafetera-probes | grep -E "Startup|Liveness|Readiness"
kubectl get endpoints cafetera-probes-svc

# Simula que el archivo /tmp/ready desaparece (falla Readiness, el Pod NO se reinicia pero sale de Endpoints):
kubectl exec deployment/cafetera-probes -- rm -f /tmp/ready
sleep 8
kubectl get pods -l app=cafetera-probes
kubectl get endpoints cafetera-probes-svc
```
> 💡 **Respuesta esperada:** Al borrar `/tmp/ready`, el Pod pasa a **`0/1 Running`** (sin reiniciarse) y su IP desaparece de `Endpoints` para que no reciba tráfico hasta volver a estar sano (`touch /tmp/ready`).

---

## ⚡ Lab 2: `requests`, `limits` y Simulación de `OOMKilled` (`Exit Code 137`)
```bash
kubectl apply -f semana-05-operacion-seguridad/1.ejemplos/02-recursos-limits-oomkilled.yaml
kubectl get pods -l app=oom-demo -w
# Presiona Ctrl+C tras ver el reinicio y revisa el motivo exacto:
kubectl describe pod -l app=oom-demo | grep -A 8 "Last State"
kubectl top pod -l app=oom-demo
```
> 💡 **Respuesta esperada:** En `Last State` verás **`Reason: OOMKilled`** y **`Exit Code: 137`** porque el contenedor intentó superar su `limit` de memoria (`32Mi`).

---

## 🏢 Lab 3: `Namespace`, `ResourceQuota` y `LimitRange`
```bash
kubectl apply -f semana-05-operacion-seguridad/1.ejemplos/03-namespace-resourcequota-limitrange.yaml
kubectl get quota,limitrange -n kubecafe-sucursal
kubectl describe resourcequota cuota-sucursal -n kubecafe-sucursal
kubectl describe pod barista-con-limites -n kubecafe-sucursal | grep -A 6 "Limits"
```
> 💡 **Respuesta esperada:** Aunque `barista-con-limites` no declaró `resources`, el **`LimitRange`** le inyectó automáticamente los `requests` y `limits` por defecto y el **`ResourceQuota`** contabilizó su consumo.

---

## 🛡️ Lab 4: Endurecimiento de Contenedor (`SecurityContext`)
```bash
kubectl apply -f semana-05-operacion-seguridad/1.ejemplos/04-security-context-nonroot.yaml
kubectl wait --for=condition=ready pod/pod-endurecido --timeout=60s
kubectl exec pod-endurecido -- id
kubectl exec pod-endurecido -- touch /etc/prueba.txt || echo "Bloqueado por readOnlyRootFilesystem"
```
> 💡 **Respuesta esperada:** `id` muestra `uid=10001 gid=10001` (nunca `root`) y `touch /etc/prueba.txt` falla con `Read-only file system`.

---

## 🪪 Lab 5: Control de Acceso `RBAC` (`ServiceAccount` + `Role` + `RoleBinding`)
```bash
kubectl apply -f semana-05-operacion-seguridad/1.ejemplos/05-rbac-serviceaccount-role.yaml

# Validar permisos desde kubectl sin necesidad de usar el Pod:
kubectl auth can-i get pods --as=system:serviceaccount:default:barista-readonly
kubectl auth can-i delete pods --as=system:serviceaccount:default:barista-readonly
kubectl auth can-i get secrets --as=system:serviceaccount:default:barista-readonly
```
> 💡 **Respuesta esperada:** `get pods` responde **`yes`**, mientras `delete pods` y `get secrets` responden **`no`** (principio de mínimo privilegio).

---

## 🧱 Lab 6: Aislamiento de Red con `NetworkPolicy` (Cilium eBPF)
```bash
kubectl apply -f semana-05-operacion-seguridad/1.ejemplos/06-networkpolicy-aislamiento.yaml
kubectl wait --for=condition=ready pod/bd-secreta pod/app-autorizada pod/app-intrusa --timeout=60s

# 1. Desde app-autorizada (label rol=backend) -> CONECTA:
kubectl exec app-autorizada -- wget -qO- --timeout=2 http://bd-secreta-svc

# 2. Desde app-intrusa (sin label rol=backend) -> BLOQUEADA (timeout):
kubectl exec app-intrusa -- wget -qO- --timeout=2 http://bd-secreta-svc || echo "Bloqueada por NetworkPolicy"
```
> 💡 **Respuesta esperada:** `app-autorizada` recibe respuesta HTTP 200, mientras `app-intrusa` queda bloqueada por la `NetworkPolicy`.
