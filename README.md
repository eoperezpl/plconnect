# PL API
API oficial para Grupo Prensa Libre. Esta librería permite conectar con diversos servicios para los sitios del grupo. 

## Instalando la librería
Para comenzar a usar el API, debe clonar o descargar el proyecto.

### Use Git

```bash
mkdir PL_API
git init
git remote add PL_API git@github.com:eoperezpl/PL_API.git
git pull PL_API master
git remote remove PL_API
```

### Use Zip

1. Descargar el paquete comprimido: <br/>
    <https://github.com/eoperezpl/PL_API/archive/master.zip>
2. Extraer en el directorio del proyecto.

### Incluir directamente
```html
<script src="https://plconnect.s3.amazonaws.com/API/latest/pl_api.bundle.js"></script>
```

## Módulos disponibles
* Auth `v1.0.0`

## Utilizando el API
Al incluir la librería generará una variable global llamada `PL_API` esta variable devuelve un objeto con
todos los módulos disponibles con posibilidad a generar instancias de los mismos. Todos los módulos utilizan un patron
`singleton`, por lo cual  siempre se devolverá el mismo objeto para evitar crear múltiples instancias en memoria.

Para inicializar un módulo puede crear una instancia del mismo derivado de `PL_API`:
```javascript
const una_variable = new PL_API.Auth();
```
Tenga en cuenta que `.Auth()` es el módulo a instancear. 

> Para consultar los modulos existentes, vea la sección "Módulos disponibles"

## Módulo `Auth`

#### Conceptos básicos
El módulo `Auth` maneja eventos globales que son disparados en diversos tiempos de ejecución del código. Los eventos globales
son los siguientes:

- `start`: Este evento se ejecuta antes de iniciar cualquier validación de autenticación.  
- `connect`: Este evento se ejecuta si el usuario **se autenticó de manera** correcta o tiene sesión iniciada.
- `disconnec`: Este evento se ejecuta si el usuario **no está autenticado o si la autenticación falló**.
- `finish`: Este evento se ejecuta al finalizar toda petición de verificación o autenticación de usuario.

> Los eventos globales se configuran por medio del método `Event`.


### Métodos disponibles

#### `Event`
El método event configura los **eventos globales**, recibe los siguientes parámetros:

- `event` _(String)_: Nombre del evento 
- `callbackEvent` _(Function)_: Callback a ejecutar cuando el evento sea disparado.

```javascript
const una_variable = new PL_API.Auth();
una_variable.Event("start", () => {
    // esto se ejecutará en el evento "start" ...
});
```

> Para ver los eventos disponibles, ver la sección "Conceptos básicos".



#### `EventTrigger`
El método EventTrigger ejecuta directamente cualquiera de los **eventos globales** disponibles, recibe los siguientes parametros:

- `event` _(String)_: Nombre del evento

> Este método ejecutará eventos globales automáticamente.

```javascript
const una_variable = new PL_API.Auth();
una_variable.EventTrigger("start");
```

> Para más información sobre eventos globales, ver la sección "Conceptos básicos".


#### `CheckLogin`
El método CheckLogin valida si un usuario está autenticado o con sesión iniciada. Recibe los siguientes parametros:

- `eventsOnGo` _(Object)_: Arbol de eventos "On Go".

> Este método ejecutará eventos globales y eventos "On Go" automáticamente.

```javascript
const una_variable = new PL_API.Auth();
una_variable.CheckLogin({
  // Arbol de eventos "On Go"
});
```

#### `MakeLogin`
El método MakeLogin autentica a un usuario. Recibe los siguientes parametros:

- `user` _(String)_: Nombre de usuario (correo electrónico).
- `password` _(String)_: Contraseña del usuario.
- `eventsOnGo` _(Object)_: Arbol de eventos "On Go".

> Este método ejecutará eventos globales y eventos "On Go" automáticamente.

```javascript
const una_variable = new PL_API.Auth();
una_variable.MakeLogin(user, password, {
    // Arbol de eventos "On Go"
});
```

#### `MakeLogout`
El método MakeLogout cerrará la sesión de un usuario autenticado, no recibe ningún parámetro y retornará `true o false`
si el cierre de sesión se realizó con éxito.


```javascript
// Make login
plconnect.MakeLogout();
```

#### `MakeRegister`
El método MakeRegister registra a usuarios nuevos e inicia sesión automáticamente si el registro fué exitoso. Recibe los siguientes parametros:

- `user` _(String)_: Nombre de usuario (correo electrónico).
- `password` _(String)_: Contraseña del usuario.
- `password_confirm` _(String)_: Confirmación de contraseña.
- `eventsOnGo` _(Object)_: Arbol de eventos "On Go".

> Este método ejecutará eventos globales y eventos "On Go" automáticamente.


#### Eventos "On Go"
Los eventos "On Go" son eventos ejecutados en paralelo al tiempo de ejecución de los **eventos globales**, sin embargo, son ejecutados únicamente en el contexto
de su llamada y configuración. Esto quiere decir que puede configurar diversos eventos personalizados al llamar métodos que soporten el árbol "On Go".

El árbol de eventos "On Go" tiene la siguiente estructura:
```
{
  'start': () => {
    // ...
  },
  'connect': () => {
    // ...
  },
  'disconnect': () => {
    // ...
  },
  'finish': () => {
    // ...
  }
}
```

Donde el evento "start" (por ejemplo) será ejecutado al mismo tiempo que el **evento global** `start`.

> Para más información sobre los eventos globales, ver la sección "Conceptos básicos".




## License

[The MIT License](http://piecioshka.mit-license.org) @ 2017
