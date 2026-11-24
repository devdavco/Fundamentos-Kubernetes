# 📔 Bitácora de Aprendizaje — 🌐 Semana 03: Redes en Kubernetes (Services y Gateway API)

> ⛵ **Tripulante:** [`@eandreaja`](https://github.com/eandreaja)  
> 🗓️ **Fecha de registro:** `2026-11-24`  
> 🎓 **Portafolio Principal:** [⬅️ Volver a mi Portafolio Profesional K8s](../README.md)

---

## 1️⃣ 💡 ¿Qué aprendí esta semana?

Aprendí que un Service reconoce a sus Pods comparando su `selector` con las etiquetas de los Pods, y que `kubectl get endpoints` es el primer lugar donde mirar: si aparece vacío (`none`), el problema es el selector. También aprendí a no mezclar los tres puertos: `port` (lo que ve el cliente), `targetPort` (a dónde reenvía el Service dentro del Pod) y `containerPort` (donde la aplicación escucha de verdad). Esta semana hice los 4 retos rotos; los laboratorios de la semana 03 los dejo para otro momento.

---

## 2️⃣ 🧩 ¿Qué fue lo más retador y cómo lo resolví?

En el reto 02 usé `kubectl get nodes -o wide` creyendo que me mostraría el puerto de los Pods, y puse `8080` como `targetPort` sin haberlo leído en ningún lado; lo corregí mirando `kubectl get pods -o wide`, el `containerPort` (80) y el `TargetPort` (9090) del `describe`. En el reto 03, `kubectl apply --dry-run=server` aceptó el archivo roto y solo el `apply` real lo rechazó por el rango del `nodePort` (30000-32767), así que el dry-run no es una garantía. En el reto 04 vi que, sin un Gateway real, el HTTPRoute se crea pero no muestra condiciones de estado, y que un `404` puede venir de Envoy (cuerpo vacío: no hay ruta) o de nginx (la página de error del backend): para distinguirlos hay que mirar el cuerpo y las cabeceras, no solo el código.

---

## 3️⃣ 💻 Comandos y herramientas que practiqué

```bash
kubectl apply -f <archivo>.yaml
kubectl apply --dry-run=server -f <archivo>.yaml
kubectl get svc <nombre> -o wide
kubectl get endpoints <nombre>
kubectl get endpointslices -l kubernetes.io/service-name=<nombre>
kubectl describe svc <nombre>
kubectl get pods -o wide --show-labels
kubectl get gateway
kubectl describe httproute <nombre>
kubectl run <prueba> --image=nginx:alpine --restart=Never --rm -i -- wget -S --spider http://<service>
curl -i http://<ip-del-gateway>/api
git checkout -b eandreaja/semana-03
```

---

## 4️⃣ 🚀 Aplicación real y próximos pasos

Quiero exponer mi proyecto de Python con un Service y, cuando lo despliegue, enrutarlo con Gateway API en vez de abrir puertos directamente. Me quedó una duda: ¿por qué `--dry-run=server` dejó pasar un `nodePort: 8080` fuera de rango y solo el `apply` real lo rechazó? No lo investigué a fondo.

---

<div align="center">
  <sub>🏔️☕ Bitácora registrada en <b><a href="https://github.com/edwinbermudez91/Fundamentos-Kubernetes">De Cero a Capitán en Kubernetes — Cloud Native Medellín (CNCF)</a></b></sub>
</div>
