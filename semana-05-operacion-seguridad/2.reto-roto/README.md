# 💥 Retos Rotos de la Semana 05: Operación, Límites y Seguridad (+40 XP)

Aquí tienes **4 incidentes reales** puestos a propósito en Kubernetes.  
Copia los 4 archivos a `aportes-comunidad/soluciones-retos/<tu-usuario>/semana-05/`, diagnostica cada fallo y envía tu Pull Request (recuerda validar antes con `./scripts/verificar-reto.sh <tu-usuario> semana-05`).

| # | Archivo | Síntoma | XP |
| :-: | :--- | :--- | :-: |
| **01** | [`01-liveness-probe-ruta-rota.yaml`](./01-liveness-probe-ruta-rota.yaml) | El Pod arranca pero entra en reinicios continuos (`Unhealthy` HTTP 404 en `livenessProbe`). | **+10 XP** |
| **02** | [`02-pod-oomkilled-limite-bajo.yaml`](./02-pod-oomkilled-limite-bajo.yaml) | El contenedor muere con `OOMKilled` (`Exit Code 137`). | **+10 XP** |
| **03** | [`03-security-context-root-bloqueado.yaml`](./03-security-context-root-bloqueado.yaml) | El Pod falla con `CreateContainerConfigError` (`container has runAsNonRoot and image will run as root`). | **+10 XP** |
| **04** | [`04-rbac-permisos-insuficientes.yaml`](./04-rbac-permisos-insuficientes.yaml) | El `ServiceAccount` no tiene permisos para listar Pods (`Forbidden`). | **+10 XP** |
