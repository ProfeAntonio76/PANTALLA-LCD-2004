//% color=#0fbc11 icon="\uf26c" block="LCD2004"
namespace lcd2004 {
    let address = 0x27
    let inited = false

    /**
     * Establece la dirección I2C del LCD (por defecto 0x27)
     */
    //% block="LCD2004 establecer dirección I2C %addr"
    //% addr.min=0x03 addr.max=0x77 addr.defl=0x27
    export function setAddress(addr: number) {
        address = addr
    }

    /**
     * Inicializa la pantalla LCD
     */
    //% block="LCD2004 inicializar pantalla"
    export function init() {
        basic.pause(50)
        write4bits(0x30)
        basic.pause(5)
        write4bits(0x30)
        control.waitMicros(150)
        write4bits(0x30)
        write4bits(0x20)
        command(0x28) // 4 bit, 2 lines, 5x8 dots
        command(0x08) // display off
        command(0x01) // clear display
        basic.pause(2)
        command(0x06) // entry mode set
        command(0x0C) // display on, cursor off, blink off
        inited = true
    }

    /**
     * Borra la pantalla LCD
     */
    //% block="LCD2004 borrar pantalla"
    export function clear() {
        command(0x01)
        basic.pause(2)
    }

    /**
     * Escribe texto en una posición concreta de la pantalla
     * @param text El texto a mostrar
     * @param row Fila (0-3)
     * @param col Columna (0-19)
     */
    //% block="LCD2004 escribir %text en fila %row columna %col"
    //% row.min=0 row.max=3 col.min=0 col.max=19
    export function printAt(text: string, row: number, col: number) {
        setCursor(row, col)
        for (let i = 0; i < text.length; i++) {
            write(text.charCodeAt(i))
        }
    }

    /**
     * Mueve el cursor a una posición concreta
     * @param row Fila (0-3)
     * @param col Columna (0-19)
     */
    //% block="LCD2004 mover cursor a fila %row columna %col"
    //% row.min=0 row.max=3 col.min=0 col.max=19
    export function setCursor(row: number, col: number) {
        let row_offsets = [0x00, 0x40, 0x14, 0x54]
        command(0x80 | (col + row_offsets[row]))
    }

    /**
     * Enciende el backlight
     */
    //% block="LCD2004 encender backlight"
    export function backlightOn() {
        i2cSend(0x08)
    }

    /**
     * Apaga el backlight
     */
    //% block="LCD2004 apagar backlight"
    export function backlightOff() {
        i2cSend(0x00)
    }

    /**
     * Muestra el cursor
     */
    //% block="LCD2004 mostrar cursor"
    export function showCursor() {
        command(0x0E)
    }

    /**
     * Oculta el cursor
     */
    //% block="LCD2004 ocultar cursor"
    export function hideCursor() {
        command(0x0C)
    }

    /**
     * Muestra el cursor parpadeante
     */
    //% block="LCD2004 mostrar cursor parpadeante"
    export function blinkCursorOn() {
        command(0x0D)
    }

    /**
     * Oculta el cursor parpadeante
     */
    //% block="LCD2004 ocultar cursor parpadeante"
    export function blinkCursorOff() {
        command(0x0C)
    }

    // --- Funciones internas ---

    function command(value: number) {
        send(value, 0)
    }

    function write(value: number) {
        send(value, 1)
    }

    function send(value: number, mode: number) {
        let highnib = value & 0xf0
        let lownib = (value << 4) & 0xf0
        write4bits(highnib | mode)
        write4bits(lownib | mode)
    }

    function write4bits(value: number) {
        i2cSend(value | 0x08) // backlight ON por defecto
        pulseEnable(value | 0x08)
    }

    function pulseEnable(data: number) {
        i2cSend(data | 0x04)
        control.waitMicros(1)
        i2cSend(data & ~0x04)
        control.waitMicros(50)
    }

    function i2cSend(data: number) {
        pins.i2cWriteNumber(address, data, NumberFormat.UInt8BE)
    }
}