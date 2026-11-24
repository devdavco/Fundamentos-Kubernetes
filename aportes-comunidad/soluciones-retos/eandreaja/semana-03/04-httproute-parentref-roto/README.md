# Reto 4: el HTTPRoute que apunta a una puerta fantasma

Mi solución del reto, semana 03 (@eandreaja).

## Síntoma

Al aplicar el archivo, el `HTTPRoute` se crea sin errores, pero no enruta nada:

```bash
kubectl apply -f 04-httproute-parentref-roto.yaml
kubectl get httproute kubecafe-api-route
kubectl describe httproute kubecafe-api-route
kubectl get gateway
```

- `get httproute` solo mostró nombre y edad, sin condiciones de estado (`Accepted` o `ResolvedRefs`). El README del reto sugiere mirarlas, pero aquí no aparecían: sin un `Gateway` al que engancharse, el controlador de Cilium no tiene dónde reportar el estado.
- `describe` mostró `Parent Refs: gateway-fantasma` y `Backend Refs: cocina-svc` con `Port: 8080`.
- `kubectl get gateway` respondió `No resources found`.

## Cómo lo investigué

El `describe` me dio los dos datos que importaban: a qué `Gateway` se engancha la ruta (`parentRefs`) y a qué puerto manda el tráfico (`backendRefs`). Comparé el nombre del `Gateway` con el que usan los ejemplos de la semana (`kubecafe-gateway`) y el puerto con el `port` de `cocina-svc` (`80`, en el ejemplo 01).

## Causa raíz

Eran dos errores en el mismo archivo:

1. `parentRefs` apuntaba a `gateway-fantasma`, un `Gateway` que no existe. Una ruta sin un `Gateway` válido al que engancharse no recibe tráfico.
2. `backendRefs` mandaba el tráfico al puerto `8080` de `cocina-svc`, pero ese Service escucha en el `80`.

## Solución

| Campo | Antes | Después |
| :--- | :--- | :--- |
| `spec.parentRefs[0].name` | `gateway-fantasma` | `kubecafe-gateway` |
| `spec.rules[0].backendRefs[0].port` | `8080` | `80` |

Cambié solo esos dos campos. La ruta (`/api`) y el nombre del Service (`cocina-svc`) ya estaban bien.

## Cómo lo comprobé

El archivo del reto solo trae el `HTTPRoute`, así que para probarlo creé aparte, desde los ejemplos de la semana, lo que le falta: `cocina-svc` con sus pods (ejemplo 01) y el `Gateway` `kubecafe-gateway` (solo el bloque `Gateway` del ejemplo 04). Eso no forma parte de esta entrega.

- El `Gateway` quedó `PROGRAMMED True` con la dirección `172.18.255.201`.
- Con la solución aplicada, las condiciones de la ruta pasaron a `Accepted=True` y `ResolvedRefs=True`.
- Hice la petición `curl -i http://172.18.255.201/api` con el archivo roto y con la solución:
  - Con el archivo roto: `404` con el cuerpo vacío (`content-length: 0`), sin pasar por ningún backend.
  - Con la solución: `404` con la página de error de nginx en el cuerpo y la cabecera `x-envoy-upstream-service-time`, que indica que la petición sí llegó al backend. El `404` es de nginx, porque `cocina-svc` no tiene ningún archivo `/api`.
- Cuando volví a aplicar el archivo roto, el `kubectl get httproute` siguió mostrando las condiciones de la aplicación anterior; por eso me fié de la petición y no del estado.
- Al final borré el `HTTPRoute`, el `Gateway` y `cocina-svc` con sus pods por su nombre.

## Qué aprendí

- Un `HTTPRoute` necesita un `Gateway` real al que engancharse (`parentRefs`) y un backend con el puerto correcto (`backendRefs`); si falla cualquiera de los dos, no enruta.
- El `port` de `backendRefs` es el puerto del **Service**, no el del contenedor.
- Sin un `Gateway`, un `HTTPRoute` se crea igual pero no muestra condiciones de estado.
- Un `404` puede venir de dos lugares: del proxy (cuerpo vacío, no hay ruta) o del backend (la página de error de nginx). Para distinguirlos hay que mirar el cuerpo y las cabeceras, no solo el código.
