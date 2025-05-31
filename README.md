# Extensión LCD2004 para MakeCode micro:bit

Controla pantallas LCD 2004 (20x4) por I2C desde MakeCode micro:bit.

## Características

- Establecer dirección I2C
- Inicializar pantalla
- Borrar pantalla
- Encender/apagar backlight
- Escribir texto en cualquier posición (fila, columna)
- Mover cursor
- Mostrar/ocultar cursor
- Mostrar/ocultar parpadeo del cursor

## Ejemplo de uso

```blocks
lcd2004.setAddress(0x27)
lcd2004.init()
lcd2004.clear()
lcd2004.printAt("Hola!", 0, 0)
lcd2004.setCursor(1, 5)
lcd2004.printAt("Micro:bit", 1, 5)
lcd2004.showCursor()
lcd2004.blinkCursorOn()
```

## Conexiones

- SDA → Pin 20 (micro:bit)
- SCL → Pin 19 (micro:bit)
- VCC → 3.3V
- GND → GND