

export class BitStream{
    private buffer:number[] = []
    private byte = 0;
    private bits = 0; 

    write(number:number, readBits:number){

        for(let i = readBits - 1; i >= 0; i--){

            const bit = (number >> i) & 1
            this.byte = (this.byte << 1) | bit;
            this.bits++;
            if(this.bits === 8){
                this.buffer.push(this.byte & 0xFF);
                this.byte = 0;
                this.bits = 0;
            }
                
        }
        
    }

    writeArr(list:Uint8Array, readBits:number){
        for(const b of list) 
            this.write(b, readBits);
    }

    writeFun(fun:((i:number)=>number), n:number, readBits:number){
        for(let i = 0; i < n; i++)
            this.write(fun(i),readBits);
    }

    padBoundary(){
        if(this.bits == 0)
            return 0

        const R = 8 - this.bits;
        this.byte <<= R
        this.buffer.push(this.byte & 0xFF);
        this.byte = 0;
        this.bits = 0; 
        return R;
    }

  
    getBuffer(addBits = true){
        const tail = this.bits == 0 || !addBits ? [] : [(this.byte << (8 - this.bits)) & 0xFF];
        return new Uint8Array(this.buffer.concat(tail));
    }

    length(){
        return this.buffer.length * 8 + this.bits;
    }
}