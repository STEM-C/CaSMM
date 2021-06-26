let reader;
let port;


export const openConnection = async () => {
    
    //requesting port on the pop up window.
    port = window['port'];

    if(typeof port === 'undefined'){
        console.log("no port selected");
        return port;
    }

    var options = {
        baudRate: 9600,
        parity: 'none',
        dataBits: 8,
        stopBits: 1,
        bufferSize: 256
      };
    
    // connect to port on baudRate 9600.
    await port.open(options);
    console.log("port opened")

    readUntilClose();
}

const readUntilClose = async () => {
    const port = window['port'];
    
    // const textDecoder = new TextDecoderStream();
    // const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    // reader = textDecoder.readable.getReader();
    // console.log(port.readable);
    reader = port.readable.getReader();

    console.log("reader opened")
    try{
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
            // Allow the serial port to be closed later.
                reader.releaseLock();
                break;
            }
            // value is a string.
            var string = new TextDecoder().decode(value);
            console.log(string);
        }
    }
    catch (error) {
        console.log(error);
    }
}
  
export const disconnect = async () => {
    if (reader) {
        await reader.cancel();
        reader = null;
    }
    await port.close();
    port = null;
}
