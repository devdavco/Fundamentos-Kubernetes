# Reto 1: el Service que no encuentra a sus Pods

Mi solución del reto, semana 03 (@eandreaja).

## Síntoma

Al aplicar el archivo, todo se crea sin errores y los 2 pods quedan `Running`, pero el Service no tiene a quién enviar el tráfico:

```bash
kubectl apply -f 01-service-selector-roto.yaml
kubectl get endpoints barra-svc
```

`get endpoints` mostró `ENDPOINTS  <none>`, aunque `kubectl get pods` mostraba los 2 pods de `kubecafe-barra` en `1/1 Running`.

## Cómo lo investigué

El `<none>` me dijo que el problema estaba entre el Service y los pods, no en los pods. Un `kubectl get svc` a secas no me mostró el criterio con el que el Service busca sus pods; con `-o wide` apareció la columna del selector, y `describe` lo confirmó:

```bash
kubectl get svc barra-svc -o wide
kubectl describe svc barra-svc
kubectl get pods --show-labels
```

- El Service tenía `Selector: app=barra-equivocada`.
- Los pods tenían la etiqueta `app=kubecafe-barra`.

## Causa raíz

Un Service reconoce a sus pods comparando su `spec.selector` con las etiquetas de los pods. Si ningún pod cumple el selector, el Service queda con la lista de endpoints vacía: existe, tiene IP, pero no hay a dónde mandar el tráfico. Aquí el selector decía `barra-equivocada` y ningún pod tenía esa etiqueta.

## Solución

| Campo | Antes | Después |
| :--- | :--- | :--- |
| `Service.spec.selector.app` | `barra-equivocada` | `kubecafe-barra` |

Cambié solo el Service. Los pods y el Deployment ya llevaban la etiqueta correcta (`app: kubecafe-barra`), así que el valor equivocado estaba únicamente en el selector.

## Cómo lo comprobé

- `kubectl apply --dry-run=server` respondió `service/barra-svc configured (server dry run)`.
- Después del `apply`, `kubectl get endpoints barra-svc` pasó de `<none>` a `10.244.0.2:80,10.244.0.234:80`, y `kubectl get endpointslices -l kubernetes.io/service-name=barra-svc` mostró las mismas dos IPs.
- Con un pod temporal (`nginx:alpine`) hice `wget -S --spider http://barra-svc` y recibí `HTTP/1.1 200 OK`. El pod de prueba se borró solo al terminar.
- Al final borré el Deployment y el Service por su nombre.

## Qué aprendí

- El selector del Service y las etiquetas de los pods tienen que coincidir; si no, `ENDPOINTS` queda en `<none>` aunque todos los pods estén sanos.
- `kubectl get endpoints` (o `get endpointslices`) es el primer lugar donde mirar: si dice `<none>`, el problema está en el selector, no en la aplicación.
- `kubectl get svc` a secas no muestra el selector; hay que usar `-o wide` o `describe`.
- Se corrige el lado que está mal: aquí el Service, no los pods.
