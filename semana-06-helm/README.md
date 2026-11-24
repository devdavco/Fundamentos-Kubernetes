# ⚓ Semana 06: Empaquetado y Despliegues con Helm (`Charts`, `Values`, `Templates` y `Releases`)

> *"En KubeCafé ya no copiamos y editamos 10 archivos YAML cada vez que abrimos una sucursal nueva. Creamos un **Kit de Franquicia (`Helm Chart`)** parametrizado con **`values.yaml`**, lo validamos con `helm lint` y lo desplegamos, actualizamos o revertimos en segundos (`install`, `upgrade`, `rollback`)."*
>
> 🧪 **Laboratorio Online (sin instalación):** [**Playground del Workshop en iximiuz**](https://labs.iximiuz.com/trainings/fundamentos-de-docker-y-kubernetes-2ae16ea8/)  
> 🇨🇴 **Comunidad Oficial CNCF:** [**Únete a Cloud Native Medellín en CNCF Community Groups**](https://ocgroups.dev/cncf/group/2majk4r)  
> 📚 **Documentación Oficial:** [**Helm Docs**](https://helm.sh/docs/) • [**Chart Template Guide**](https://helm.sh/docs/chart_template_guide/) • [**Helm CLI**](https://helm.sh/docs/helm/)

---

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana serás capaz de:
1. Instalar, listar y desinstalar Charts de repositorios oficiales (`helm repo`, `helm install`, `helm list`).
2. Entender la anatomía de un **Helm Chart**: `Chart.yaml`, `values.yaml`, `templates/`, `NOTES.txt` y `tests/`.
3. Validar y renderizar plantillas localmente antes de tocar el clúster (`helm lint`, `helm template`, `--dry-run --debug`).
4. Gestionar el ciclo de vida de un Release con **`helm upgrade`**, **`helm history`** y **`helm rollback`**.
5. Crear y ejecutar pruebas automatizadas con **`helm test`** (*Helm Hooks*).
6. Resolver los **6 Retos Rotos de Helm** en [`2.reto-roto/`](./2.reto-roto) para sumar **+60 XP**.

---

## 📂 Contenido de la Semana

| Carpeta | Contenido | Acceso |
| :--- | :--- | :---: |
| **`1.ejemplos/`** | 5 laboratorios guiados + Chart oficial `kubecafe-chart/` | [🧪 Abrir Ejemplos](./1.ejemplos/README.md) |
| **`2.reto-roto/`** | 6 retos prácticos (4 de Charts/Templates + 2 interactivos de CLI y `helm test` — `+60 XP`) | [💥 Abrir Retos Rotos](./2.reto-roto/README.md) |
