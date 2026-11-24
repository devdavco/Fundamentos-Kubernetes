# 💥 Retos Rotos de la Semana 06: Helm (`+60 XP`)

Aquí tienes **6 retos prácticos de Helm** (4 de reparación de Charts/templates y 2 retos interactivos con `helm test` y comandos CLI de `upgrade`/`rollback`).

Copia la carpeta `2.reto-roto/` a `aportes-comunidad/soluciones-retos/<tu-usuario>/semana-06/`, repara cada reto y valida antes de abrir tu PR con `./scripts/verificar-reto.sh <tu-usuario> semana-06`.

| # | Carpeta | Tipo | Error / Misión | XP |
| :-: | :--- | :---: | :--- | :-: |
| **01** | [`01-chart-metadata-roto/`](./01-chart-metadata-roto) | 📄 Chart YAML | `Chart.yaml` con `apiVersion` y `version` SemVer inválidos (`helm lint` falla). | **+10 XP** |
| **02** | [`02-template-values-roto/`](./02-template-values-roto) | 🧩 Go Template | `templates/deployment.yaml` referencia `{{ .Values.imagen.tag }}` que no existe en `values.yaml`. | **+10 XP** |
| **03** | [`03-template-indentacion-nindent/`](./03-template-indentacion-nindent) | 📐 Indentación | Falta `\| nindent 12` en `resources` dentro de `templates/deployment.yaml`. | **+10 XP** |
| **04** | [`04-service-port-mismatch/`](./04-service-port-mismatch) | 🌐 Red / Chart | `service.yaml` apunta a `targetPort: 8080` y selector equivocado mientras Nginx escucha en `80`. | **+10 XP** |
| **05** | [`05-helm-hook-test-roto/`](./05-helm-hook-test-roto) | 🧪 **Interactivo (`helm test`)** | El hook `helm.sh/hook: test` falla porque consulta el puerto `:9999`. Repáralo hasta ver `Phase: Succeeded`. | **+10 XP** |
| **06** | [`06-helm-cli-upgrade-rollback/`](./06-helm-cli-upgrade-rollback) | ⌨️ **Interactivo (Comandos CLI)** | Despliega `v1`, provoca fallo con `values-prod.yaml`, audita con `helm history`, haz `helm rollback` y entrega `values-prod.yaml` + `solucion.sh` corregidos. | **+10 XP** |
