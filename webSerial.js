//--- Impressora ---
async function printOut_L42DT(){
    var portImpressora
    console.log("1")
    const ports = await navigator.serial.getPorts()
    console.log(ports)
    ports.forEach(async (device) => {
      var {usbProductId, usbVendorId} = device.getInfo()
      console.log(usbProductId)
      console.log(usbVendorId)
      if((usbProductId == '8963') && (usbVendorId == '1659')){ //productId e vendorId da impressora (cei-nlad-48470)
        console.log("2")
        portImpressora = device
        
        await portImpressora.open({baudRate: 9600})

        const encoder = new TextEncoderStream()
        var outputDone = encoder.readable.pipeTo(portImpressora.writable)
        var outpuStream = encoder.writable

        codigoDeBarras = '56743218975'
        peso = '65.4'
        const etiqueta = '^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR2,2~SD15^JUS^LRN^CI0^XZ\r\n^XA\r\n^MMT\r\n^PW511\r\n^LL0336\r\n^LS0\r\n^FO32,0^GFA,03584,03584,00056,:Z64:\r\neJztVc9rG0cUfrO7zWyKya5CjRUaGMmEEHIo8iHgk1eRQpNjDFLppcSmtx6KAz30oEqDnYMIhbbOtZAeQ079C9qlLtW1KfRY2OTSY1eH0qFImn5v9CtygmJ86sHP2tl93v32e2/e994SndmZHbPVU+IifTqcSpfdvereesiLn52cT9z4Gutbj6pYO3aRbxmOtIclOGSctQtPLuULKADkygd3iKS1+QJfugRXAiORd1FPcZzke/D+Bd/olZxnViGKSTyib/D+oRpgtSRsLv+xqXpsU3aV7OON4ldR5Wen6TnKLq0TJdoHQWK1b0f+XzaLHtsMe6XVVxlw3veEuDenuHSSIn4d4p+1KQLmmBXHDVclzBfEBL5bL4UakueI2yBDjCCy9sBag5NhV/0IPhOEjJuacEdBk4iJk9P+cM2oZ52eXRuo4drAHyrw9hkn8tuVVkupGc4DI2dpuGS+8Y3S6mBAg8iIgZ/DxQ0ynujWwi9r5Q09L6HkRAXjUpmLgaKoZ6itchrIDC6qI4zoB7XCg/puxWHOTYuIW7gt0ygj4ORRTlu4bEcpXC6hoY2gFmqvFE64ANCXse6NcRBJGynInBJcdnC0WDcI5lJQv6TrX6jjCmBl+BlEuQVBw9niSxxt1vd5E5xfAd9+iVx+Kw7CGxyMcXiISWRGyvERcDhjPwtBvfjz7d2NOZNmFWxOcE+f/hDl5ENhjhouXoU6eKXu7pPu1fV3F2pInBvvDURiI8sO8yXsoqisgOr2dnXvndXViVYW8hMZP+jbbMZn7UhpqM4c3w48nDawNuZ8wg4W+Ej+3Rzj4lfRk/1kAkpG4IvmfKikmRea7bLLj9fPZOb4fm82ac06Pg2+ZrMJ2bGYqggsXiDVO5zprA4we5C5/BJ2waeBw23t+FhpgQPyWmWczMZDRfWySX6Mw98YV52xBbNdLc30ch36Pprr5Trz+Ya+o2NbI2iPM53oGkLukOzl0ArijFL0g0YFjYj/yFv3+9+2WvdnU8/1+7iPuB8S9AP6iPPjnRzzifjj8Kdy90X8oIzwpIuVo90R3O+u/5JU9tC3nJ/MfW7HVAK3W6wXglp8qzBn07yM54SRRmXR0cg3nJ9zUb/IeNfWQ68c1mKvpLn33Pwkni+dyVzK1dD2oCzOz7laDq3xP7wJvkY9bhQ+Jzc/Mc9KFOIhTSOeg5N5ljMfu6zrgfHCcrhfplpxv8LbvzOfn0kqRvxRmsxPLmXCLqpnh+bcys3i+4WVWvxLYTzG+PeQ9rGZmY8UE+Yc+X9a7fjgcv8Zc+HC8+6n17ov3v5k8wlwRRIVEhcbz4Bz3SKBvZfL55a/76vs4nyvf1fEBYrjbUHbhbtjqSDF0mEXYkFsLzfHUvOrXLzgNwx+7F06/bd8E47uXOHVfd85tZPy0UfcFvgAwvjzd2K+19ub+V5vp+U7szP7H9h/6Tvt+w==:ECAF\r\n^BY4,2,140^FT70,210^BUN,,Y,N\r\n^FD'+codigoDeBarras+'^FS\r\n^FT139,294^A0N,39,38^FH\^FDPeso(kg):^FS\r\n^FT306,294^A0N,39,38^FH\^FD'+peso+'^FS\r\n^PQ1,0,1,Y^XZ'

        const writer = outpuStream.getWriter()
        await writer.write(etiqueta)
        if(outpuStream){
            await writer.close()
            await outputDone
            outpuStream = null
            outputDone = null
            await portImpressora.close();
            portImpressora = null;
        }
      }
    })
}

//---- Balanca ----
var inputDone = null, reader = null, inputStream = null, portBalanca
async function readBalance(){
  portOpen = false
  const ports = await navigator.serial.getPorts();
  //console.log(ports)
  ports.forEach(async (device) => {
    var {usbProductId, usbVendorId} = device.getInfo();
    if((usbProductId == '24577') && (usbVendorId == '1027')){ //productId e vendorId da balanca (cei-nlad-48470)
      portBalanca = device;     
      await portBalanca.open({ baudRate: 9600, bufferSize: 4096})
      .then(() => {
        const decoder = new TextDecoderStream()
        inputDone = portBalanca.readable.pipeTo(decoder.writable)
        inputStream = decoder.readable
        reader = inputStream.getReader()
        portOpen = true
      })
      .catch(async () => {
        console.log("Erro To Open.")
      })     
      var valueFull = ""
      var stringValor = ""
      var valorReal = ""
      if(portOpen){
        while(true){
          var { value, done } = await reader.read()            
          if(done) break
          //value é uma string
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
              document.getElementById('valor').innerHTML = valorReal
              console.log(valorReal)
            }
            valueFull=""
            break//return valorReal //Retorna valor lido (number)
          }
        }
      }
      if(inputStream){
        await reader.cancel()
        await inputDone.catch(() => {})
        reader = null
        inputDone = null
        await portBalanca.close();
        portBalanca = null;
      }
    }
  })
}
setInterval(readBalance, 700);
//setInterval(printOut_L42DT, 8000);