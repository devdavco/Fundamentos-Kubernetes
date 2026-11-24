# 🛡️ Semana 05: Salud, Límites, Seguridad y RBAC (`Probes`, `Quotas`, `SecurityContext`, `NetworkPolicy`, `RBAC`)

> *"En KubeCafé no basta con servir café: necesitamos termómetros en cada máquina (`Probes`), topes de agua y electricidad para que una mesa no apague toda la sucursal (`Limits` y `ResourceQuotas`), baristas trabajando con guantes sin permisos de administrador (`SecurityContext` y `RBAC`), y puertas internas para que solo el personal autorizado entre a la bodega (`NetworkPolicies`)."*
>
> 🧪 **Laboratorio Online (sin instalación):** [**Playground del Workshop en iximiuz**](https://labs.iximiuz.com/trainings/fundamentos-de-docker-y-kubernetes-2ae16ea8/)  
> 🇨🇴 **Comunidad Oficial CNCF:** [**Únete a Cloud Native Medellín en CNCF Community Groups**](https://ocgroups.dev/cncf/group/2majk4r)  
> 📚 **Documentación Oficial:** [**Probes**](https://kubernetes.io/es/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) • [**Resource Management**](https://kubernetes.io/es/docs/concepts/configuration/manage-resources-containers/) • [**Security Context**](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) • [**RBAC**](https://kubernetes.io/es/docs/reference/access-authn-authz/rbac/) • [**NetworkPolicies**](https://kubernetes.io/es/docs/concepts/services-networking/network-policies/)

---

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana serás capaz de:
1. Configurar sondas **`StartupProbe`**, **`ReadinessProbe`** y **`LivenessProbe`** para evitar enviar tráfico a Pods que aún arrancan o están bloqueados.
2. Dimensionar **`requests`** y **`limits`** de CPU/RAM, diagnosticar **`OOMKilled` (`Exit Code 137`)** y aplicar **`ResourceQuota`** + **`LimitRange`** por `Namespace`.
3. Endurecer contenedores con **`securityContext`** (`runAsNonRoot`, `allowPrivilegeEscalation: false`, `capabilities.drop: ["ALL"]`, `readOnlyRootFilesystem`).
4. Aplicar el principio de mínimo privilegio con **`RBAC`** (`ServiceAccount`, `Role`, `RoleBinding`) y validar permisos con `kubectl auth can-i`.
5. Aislar tráfico entre Pods con **`NetworkPolicy`** sobre **Cilium CNI**.
6. Resolver los **4 Retos Rotos** en [`2.reto-roto/`](./2.reto-roto) para sumar **+40 XP**.

---

## 📂 Contenido de la Semana

| Carpeta | Contenido | Acceso |
| :--- | :--- | :---: |
| **`1.ejemplos/`** | 6 laboratorios guiados paso a paso (`Probes`, `OOMKilled`, `ResourceQuota`, `SecurityContext`, `RBAC`, `NetworkPolicy`) | [🧪 Abrir Ejemplos](./1.ejemplos/README.md) |
| **`2.reto-roto/`** | 4 escenarios reales con errores a diagnosticar (`+40 XP`) | [💥 Abrir Retos Rotos](./2.reto-roto/README.md) |
