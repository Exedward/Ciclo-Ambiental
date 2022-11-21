//-------------------------------------- Function deviceConnect ----------------------------------
  function deviceConnect(vendorId, productId){ //vendorId e productId do dispositivo específico (balance or printer)
    navigator.serial.addEventListener('connect', async () => {
      const ports = await navigator.serial.getPorts();
      ports.forEach((port) => {
        var {usbProductId, usbVendorId} = port.getInfo();
        if((usbProductId == productId) && (usbVendorId == vendorId)){ 
          console.log("Dispositivo Conectado")
        }
      });
    });
  }
  //-------------------------------------- Function deviceDisconnect -------------------------------
  function deviceDisconnect(vendorId, productId){
    navigator.serial.addEventListener('disconnect', async () => {
      var desconectado=true
      const ports = await navigator.serial.getPorts();
      ports.forEach((port) => {
        var {usbProductId, usbVendorId} = port.getInfo();
        if((usbProductId == productId) && (usbVendorId == vendorId)){ 
          desconectado=false
        }
      });
      if(desconectado){
        console.log("Dispositivo Disconectado")
      }
    });
    return
  }

  //-------------------------------------- Function printOut_L42DT -----------------------------------------
  async function printOut_L42DT(nameProduct, barCode, valorPeso){
    const portImpressora;
    const ports = await navigator.serial.getPorts();
    ports.forEach(async (device) => {
      var {usbProductId, usbVendorId} = device.getInfo();
      if((usbProductId == '8963') && (usbVendorId == '1659')){ //productId e vendorId da impressora
        portImpressora=device;
        
        await portImpressora.open({ baudRate: 9600, bufferSize: 4096});

        var textEncoder = new TextEncoderStream();
        var writableStreamClosed = textEncoder.readable.pipeTo(portImpressora.writable);
        var writer = textEncoder.writable.getWriter();

        var len=nameProduct.length;
        var posNumber=242-(len*10);
        var posString=posNumber.toString();

        var etiqueta="^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR2,2~SD15^JUS^LRN^CI0^XZ\r\n^XA\r\n^MMT\r\n^PW495\r\n^LL0320\r\n^LS0\r\n^FO0,0^GFA,19200,19200,00060,:Z64:\r\neJzt3MsJwkAUBdCRgNkI6cAaLMBiLMGly5SWUlKIMOYDrvW9RTCeC/N2Zz4FzC1FZFdpayDjaiO01oU2z8hlu+Xgrg+99DGPc4iW63uD79PN4x6z7TyGmD3004raYfWhTLYJ0nLL2WPUXv7PnliWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZdmP7S/+K9/KbtU5kOlJyPQzZHohUn0UmR6MTP9GpvejiXWVjMsOiZ4Tkf3kBS+AJwQ=:2890\r\n^FT148,295^A0N,28,28^FH\^FDPESO(kg):^FS\r\n^FT"+posString+",70^A0N,39,38^FH\^FD"+nameProduct+"^FS\r\n^FT272,295^A0N,28,28^FH\^FD"+valorPeso+"^FS\r\n^BY3,2,144^FT100,224^BUN,,Y,N\r\n^FD"+barCode+"^FS\r\n^PQ1,0,1,Y^XZ";

        await writer.write(etiqueta);

        writer.releaseLock()
        await portImpressora.close()
      }
    })
  }
  //-------------------------------------- Function readBalance -----------------------------------------
  async function readBalance(){
    const ports = await navigator.serial.getPorts();
    ports.forEach(async (device) => {
      var {usbProductId, usbVendorId} = device.getInfo();
      if((usbProductId == '24577') && (usbVendorId == '1027')){ //productId e vendorId da balanca 
        const portBalanca=device;

        await portBalanca.open({ baudRate: 9600, bufferSize: 4096});

        const textDecoder1 = new TextDecoderStream()
        const readableStreamClosed = portBalanca.readable.pipeTo(textDecoder1.writable)
        const reader = textDecoder1.readable.getReader()

        var valueFull=""
        var stringValor=""
        var valorReal=""

        while(true){
          var { value, done } = await reader.read()            
          if(done){
            reader.releaseLock()
            await portBalanca.close()
            break
          }
          //value é uma string
          console.log("Aqui")
          valueFull+=value
          if(valueFull.indexOf("\r\n") != -1){
            function checkSum(msg){
              let check=0
              for(let i=0; i<valueFull.length; i++){
                check+=valueFull.charCodeAt(i)
                if(valueFull.charCodeAt(i) == 3){
                  check=check & 0xFF
                  break
                }
              }
              return String.fromCharCode(check)
            }
            if(checkSum(valueFull) == valueFull.charAt(valueFull.indexOf("\r\n")-1)){
              stringValor=valueFull.substring(valueFull.indexOf("kg")-5, valueFull.indexOf("kg"))
              valorReal=Number(stringValor)
            }
            valueFull=""
            return valorReal //Retorna valor lido (number)
          }
        }
      }
    });  
  }
  //-------------------------------------- Function readScanner -----------------------------------------
  function readScanner(){
    var barcode = '';
    var barcode2 = '';
    var interval;
    document.addEventListener('keydown', function (evt) {
      if(interval) clearInterval(interval);
      if(evt.code == 'Enter'){
        if(barcode){
          barcode2 = barcode
          barcode= '';
          return barcode2 //Retorna valor lido (string) com digito de verificacao 
        }
      }
      if(evt.key != 'Shift') barcode += evt.key
      interval = setInterval(() => barcode = '', 20)
    });
  }




