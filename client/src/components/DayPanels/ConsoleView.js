let port;
let reader;
let readableStreamClosed;

export const openConnection = async (baudRate_) => {
    
    //requesting port on the pop up window.
    port = window['port'];

    if(typeof port === 'undefined'){
        console.log("no port selected");
        return port;
    }

    var options = {
        baudRate: baudRate_,
        parity: 'none',
        dataBits: 8,
        stopBits: 1,
        bufferSize: 1024,
      };
    
    // connect to port on baudRate 9600.
    await port.open(options);
    console.log(`port opened at baud rate: ${baudRate_} `);

    readUntilClose();
}

const readUntilClose = async () => {
    port = window['port'];
    
    // reader = port.readable.getReader();

    const textDecoder = new window.TextDecoderStream();
    readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();

    console.log("reader opened")
    let string = "";
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
        // Allow the serial port to be closed later.
            reader.releaseLock();
            break;
        }
        console.log(value);
        string+=value;
        document.getElementById("console-content").innerHTML = string;
    }

}

  
export const disconnect = async () => {
    if (reader) {
        await reader.cancel();
        reader = null;
    }
    await readableStreamClosed.catch(() => { /* Ignore the error */ });
    await port.close();
}
