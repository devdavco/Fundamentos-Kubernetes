# 📔 Bitácora de Aprendizaje — 🌐 Semana 03: Redes en Kubernetes (Services y Gateway API)

> ⛵ **Tripulante:** [`@juanjosegonzalezrosales`](https://github.com/juanjosegonzalezrosales)  
> 🗓️ **Fecha de registro:** `2026-11-24`  
> 🎓 **Portafolio Principal:** [⬅️ Volver a mi Portafolio Profesional K8s](../README.md)

---

## 1️⃣ 💡 ¿Qué aprendí esta semana?

** durante esta semana aprendi sobre: ** 
- la conectividad de los pods a través de los distintos tipos de services
- el coredns interno del cluster.
-  el gateway API (Gateway y HTTPRoute

---

## 2️⃣ 🧩 ¿Qué fue lo más retador y cómo lo resolví?

realmente lo que mas me costó fue el componente conceptual de los temas

---

## 3️⃣ 💻 Comandos y herramientas que practiqué

```bash
kubectl get svc,endpoints
kubectl get endpointslices -l kubernetes.io/service-name=<nombre-svc>
kubectl describe svc <nombre>
kubectl get pods --show-labels
kubectl describe httproute <nombre>
```

---

## 4️⃣ 🚀 Aplicación real y próximos pasos

Estos nuevos conocimientos me han permitido entender de mejor manera los manifiestos y detectar errores dentro del cluster

---

<div align="center">
  <sub>🏔️☕ Bitácora registrada en <b><a href="https://github.com/edwinbermudez91/Fundamentos-Kubernetes">De Cero a Capitán en Kubernetes — Cloud Native Medellín (CNCF)</a></b></sub>
</div>
