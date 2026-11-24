# ⌨️ Reto 06 (Interactivo por Comandos CLI): Upgrade, History y Rollback en Helm

## 🎯 Misión
1. Instala la versión inicial estable (`v1`) del Chart:
   ```bash
   helm install r6 ./06-helm-cli-upgrade-rollback
   ```
2. Simula un despliegue fallido aplicando `values-prod.yaml` (tiene `tag: version-fantasma-999`):
   ```bash
   helm upgrade r6 ./06-helm-cli-upgrade-rollback -f ./06-helm-cli-upgrade-rollback/values-prod.yaml
   kubectl get pods -l app=reto-06-web
   ```
3. Audita el historial y haz rollback a la revisión 1:
   ```bash
   helm history r6
   helm rollback r6 1
   ```
4. **Entrega tu solución:**
   - Corrige `values-prod.yaml` (cambia `version-fantasma-999` por `alpine`).
   - Completa `solucion.sh` con la secuencia exacta de comandos (`helm install`, `helm upgrade`, `helm history`, `helm rollback`) y vuelve a ejecutar `helm upgrade` con `values-prod.yaml` corregido.
