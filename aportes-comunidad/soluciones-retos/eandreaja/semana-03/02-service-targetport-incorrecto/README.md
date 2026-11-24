# Reto 2: el Service que le toca la puerta a un puerto equivocado

Mi solución del reto, semana 03 (@eandreaja).

## Síntoma

Al aplicar el archivo, el Deployment y el Service se crean sin errores y el pod queda `Running`. A diferencia del reto 1, aquí el Service sí tiene endpoints, pero la conexión no funciona:

```bash
kubectl apply -f 02-service-targetport-incorrecto.yaml
kubectl get endpoints caja-svc
kubectl run prueba-caja --image=nginx:alpine --restart=Never --rm -i -- wget -S --spider -T 5 http://caja-svc
```

- `get endpoints` mostró `10.244.0.183:9090`.
- `wget` desde un pod temporal respondió `wget: can't connect to remote host: Connection refused`.

## Cómo lo investigué

Como el Service sí encontraba al pod (la IP de `ENDPOINTS` coincidía con la del pod), descarté un problema de selector y miré los puertos:

```bash
kubectl get pods -o wide
kubectl describe svc caja-svc
kubectl get deployment kubecafe-caja -o jsonpath='{.spec.template.spec.containers[0].ports[0].containerPort}'
```

- La IP del pod era `10.244.0.183`.
- El `containerPort` del Deployment era `80`.
- El Service tenía `Port: 80` y `TargetPort: 9090`.

## Dónde me confundí

Al principio usé `kubectl get nodes -o wide`, que lista los nodos y no los pods, y para el puerto repetí el `8080` de otro lugar en vez de leer el `containerPort`. Lo corregí mirando `get pods -o wide` y la tabla de los tres puertos: `port` (lo que ve el cliente), `targetPort` (a dónde reenvía el Service dentro del pod) y `containerPort` (donde la aplicación escucha de verdad).

## Causa raíz

El Service recibe el tráfico en su `port` y lo reenvía al `targetPort` del pod. Aquí el `targetPort` era `9090`, pero nginx escucha en el `80`. El Service encontraba al pod, pero le mandaba el tráfico a un puerto donde nadie escuchaba, y por eso la conexión se rechazaba.

## Solución

| Campo | Antes | Después |
| :--- | :--- | :--- |
| `Service.spec.ports[0].targetPort` | `9090` | `80` |

Cambié solo el `targetPort`. El `port` del Service (`80`) y el Deployment ya estaban bien.

## Cómo lo comprobé

- `kubectl apply --dry-run=server` respondió `service/caja-svc configured (server dry run)`.
- Después del `apply`, `ENDPOINTS` pasó de `10.244.0.183:9090` a `10.244.0.183:80`.
- Con un pod temporal, `wget -S --spider http://caja-svc` pasó de `Connection refused` a `HTTP/1.1 200 OK`. El pod de prueba se borró solo al terminar.
- Al final borré el Deployment y el Service por su nombre.

## Qué aprendí

- Un Service con endpoints no garantiza que funcione: la IP puede ser correcta y el puerto no.
- `targetPort` tiene que apuntar al puerto donde escucha la aplicación (`containerPort`); `port` es solo el que ven los clientes.
- Si `ENDPOINTS` tiene un puerto raro, compáralo con el `containerPort` del Deployment. Si la conexión da `Connection refused` y los endpoints existen, el primer sospechoso es el `targetPort`.
- `kubectl get nodes` y `kubectl get pods` son cosas distintas: para la IP de un pod se usa `get pods -o wide`.
