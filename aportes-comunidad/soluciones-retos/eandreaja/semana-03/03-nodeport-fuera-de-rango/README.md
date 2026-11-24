# Reto 3: el NodePort que no entra en el rango

Mi solución del reto, semana 03 (@eandreaja).

## Síntoma

Al aplicar el archivo, el API Server rechaza el Service y no se crea nada:

```bash
kubectl apply -f 03-nodeport-fuera-de-rango.yaml
kubectl get svc vitrina-svc
```

El `apply` respondió:

`The Service "vitrina-svc" is invalid: spec.ports[0].nodePort: Invalid value: 8080: provided port is not in the valid range. The range of valid ports is 30000-32767`

Y `get svc` respondió `NotFound`: el Service no llegó a existir.

## Cómo lo investigué

Como el API Server lo rechazó antes de crear nada, no había ningún recurso que `kubectl describe` pudiera mirar. Toda la información estaba en el mensaje del `apply`: decía qué campo falla (`spec.ports[0].nodePort`), qué valor tenía (`8080`) y cuál es el rango permitido (`30000-32767`). Con eso busqué en el archivo la línea `nodePort: 8080`.

## Causa raíz

Un Service de tipo `NodePort` abre un puerto en los nodos del clúster, y Kubernetes solo permite que ese puerto esté entre 30000 y 32767. El archivo pedía `8080`, que está fuera del rango, así que el API Server lo rechazó.

## Solución

| Campo | Antes | Después |
| :--- | :--- | :--- |
| `Service.spec.ports[0].nodePort` | `8080` | `30001` |

Elegí `30001` porque está dentro del rango. Cambié solo el `nodePort`: el `port` (`80`) y el `targetPort` (`80`) no tienen que ver con el error.

## Cómo lo comprobé

- Primero el original: el `apply` real lo rechazó con el mensaje de arriba.
- Después de la corrección, `kubectl apply` respondió `service/vitrina-svc created`, y `kubectl get svc vitrina-svc` mostró `NodePort` con `PORT(S) 80:30001/TCP`.
- Un detalle que observé: `kubectl apply --dry-run=server` aceptó **también el original** (`created (server dry run)`), y solo el `apply` real lo rechazó. Para este error no me bastó el `dry-run`; no investigué por qué.
- Este archivo no crea ningún Deployment con la etiqueta `app: kubecafe-menu`, así que el Service quedó sin endpoints. Es esperado: el reto solo trata del rango del `nodePort`.
- Al final borré el Service por su nombre.

## Qué aprendí

- Un `NodePort` solo puede estar entre 30000 y 32767.
- Cuando el API Server rechaza un manifiesto no se crea nada, y el mensaje del `apply` es la pista: dice el campo, el valor y la regla.
- `--dry-run=server` no es una garantía de que el `apply` real vaya a funcionar: con este error pasó el original y falló solo el `apply` real.
- `port`, `targetPort` y `nodePort` son tres cosas distintas: el puerto del Service, el del pod y el de los nodos.
