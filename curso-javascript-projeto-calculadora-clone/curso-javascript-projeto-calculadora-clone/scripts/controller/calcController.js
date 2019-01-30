class CalcController{ //sempre em maiusculo primeira letra

    constructor(){
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    copyToClipboard() {

        let input = document.createElement('input'); //cria o elemento no html

        input.value = this.displayCalc; //coloca o valor que esta no display no input

        document.body.appendChild(input); //faz o input pertencer ao body. sendo possivel copiar/selecionar o value

        input.select(); // seleciona o conteudo do input

        document.execCommand("Copy"); // selecionado o sistema copia

        input.remove(); // retira o input da tela.

    }

    pasteFromClipboard() {

        document.addEventListener('paste', e=>{ //adiciona o evento colar
           let text = e.clipboardData.getData('Text'); //pega do clipboard o arquivo em texto (mesmo sendo int)
          if (isNaN(text)) {

            this.displayCalc = this.setError();
          } else {
           this.displayCalc = parseFloat(text.replace (',', '.')); // o que recebe do texto, manda pro display da calculadora
          }
        });
    }

 
    initialize(){
            
        this.setDisplayTime();

        setInterval(() => {

            this.setDisplayTime();
            
        }, 1000);
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();


    document.querySelectorAll('.btn-ac').forEach(btn=> {

            btn.addEventListener('dblclick', e=> {

                this.toggleAudio();
            });
    });
        /*setTimeout(() =>{
            clearInterval (interval);
        }, 10000);*/
    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff; // ele e o contrario dele mesmo

        /* if ternary - ternario*/
        /*this._audioOnOff = (this._audioOnOff) ? false: true;*/ // se for verdade (? entao)  (: se nao)

        /*if(this._audioOnOff) { 
            this._audioOnOff = false;
        } else {
            this._audioOnOff = true;
        }*/
    }

    playAudio() {
        
        if(this._audioOnOff) {
            this._audio.currentTime = 0; //tocar sempre do inicio
            this._audio.play(); //tocar o som
        }
    }

    initKeyboard(){

        document.addEventListener('keyup', e=> { // quando soltar a tecla

            this.playAudio();

            switch(e.key){

                case 'Escape': //nome dos eventos de cada tecla
                    this.clearAll();
                    break;
                case '': 
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key); //retorna o valor da tecla pressionada
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();     
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                break;
            }

        });

    }

    addEventListenerAll(element, events, fn /*element=btn - events=click drag - fn=e=>*/){

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });
    }

    clearAll(){
        this._operation = []; //limpa o array
        this._lastNumber = ''; //deixa o ultimo numero como vazio e operador tbm
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop(); //tira o ultimo valor do array

        this.setLastNumberToDisplay(); 
    }

    getLastOperation(){
        return this._operation[this._operation.length-1]; //pega o tamanho do array -1 e pega esse ultimo valor

    }
    isOperator(value){
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1) // confere no ultimo espaco do array se e operad.
        
    }
    setLastOperation(value){
        this._operation[this._operation.length-1] = value; //coloca o valor na ultima posic do array
    }
    pushOperation(value){
        this._operation.push(value); //coloca o valor no ultimo posic do array

        if (this._operation.length >3 ) { //verifica se a expressao contem 3 elementos, se sim, faz o calc

            this.calc();
        }
    }
    getResult(){

        try{ //tenta isso, se nao der
            return eval(this._operation.join('')); // junta as 3 operacao, faz o eval e joga no result
        } catch(e) {  //cai nessa area e mostra o erro (areas sensiveis da aplicacao)
            setTimeout(()=> {
                this.setError();
            }, 1);
            
        }
    }
    calc(){

        let last = '';

        this._lastOperator = this.getLastItem(); //guarda o ultimo operador no lastoperator

        if(this._operation.length < 3) { // se for menor q 3

            let firstItem = this._operation[0]; // salva o primeiro item do array
            this._operation = [firstItem, this._lastOperator, this._lastNumber]; //pega o primeiro item, 
                                                                                //ultimo operador e ultimo numero
        }

        if (this._operation.length > 3) { // se a operacao for maior q 3

            last = this._operation.pop(); //tira a ultima operacao e guarda no last
            this._lastNumber = this.getResult(); //guarda no lastNumber o ultimo numero

        }else if(this._operation.length == 3) { //se a operacao for igual a 3  
            //else if porque o .pop (do 1 if) tira 1 da lenght da _operation, assim caindo na == e fazendo opcao
            this._lastNumber = this.getLastItem(false); //guarda no lastnumber o ultimo numero do geslastitem(false)

        }


        let result = this.getResult(); 

        if (last == '%') { //se a ultima operacao digitada for % faca

            result /= 100;

            this._operation = [result];

        }else {

            this._operation = [result]; //se nao for %

            if(last) this._operation.push(last); //se o last for algo, adiciona ao last

        }

        this.setLastNumberToDisplay();

    }
    getLastItem(isOperator = true){
        let lastItem;

        for(let i = this._operation.length-1; i >= 0; i--){
            if(this.isOperator(this._operation[i]) == isOperator) { //se nao for um operador --- ou seja, um numero (! e um not)
                lastItem = this._operation[i];
                break;
            }

            if(!lastItem && lastItem !== 0) {
                
               lastItem = (isOperator) ? this._lastOperator : this._lastNumber; 
                    //condicao, se for verdade (? - entao) faca isso (: - se nao for verdade) faz a outra
               
            }
        }
        return lastItem;
    }


    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addOperation(value){

        //console.log('A', value, isNaN(this.getLastOperation()));

        if(isNaN(this.getLastOperation())) { //string
            
            if (this.isOperator(value)){ //trocando operador
                    this.setLastOperation(value);
                    /*this.clearEntry();
                    this._operation.push(value);*/

            } else { //adicionar o operador no array

                    this.pushOperation(value);

                    this.setLastNumberToDisplay();
            } 

        } else { //Number

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else { // tambem atualiza display
                let newValue;

                if (this.getLastOperation().toString() !=='0') {
                    newValue = this.getLastOperation().toString() + value.toString();
                } else {

                    newValue = value.toString();
                }
                    this.setLastOperation(newValue);
                    this.setLastNumberToDisplay();
            }
        }
    }
    setError(){

        this.displayCalc = "ERROR";
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation ) {

            this.pushOperation('0.');

        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
            this.setLastNumberToDisplay();
    }

    execBtn(value){

        this.playAudio();

        switch(value){

            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;  
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc('=');
                break;
            case 'ponto':
                this.addDot('.');     
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents() {
        
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach((btn, index) =>{

            this.addEventListenerAll(btn, 'click drag', e=>{

               let textBtn = btn.className.baseVal.replace("btn-", "");

               this.execBtn(textBtn);

            });

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=> {

                btn.style.cursor = "pointer"; 

            });

            /*btn.addEventListener('drag', e=>{

                console.log(btn.className.baseVal.replace('btn-',''));
            });*/
            
        });
    }

    setDisplayTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit', 
            month: 'short',
            year: 'numeric'}
        );

        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }

    get displayTime(){
        return this._timeEl.innerHTML
    }

    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return  this._dateEl.innerHTML
    }

    set displayDate(value){
        return  this._dateEl.innerHTML = value;
    }

    get displayCalc(){
         return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if (value.toString.length > 10) { //converte o valor para string e se for menor q 10
            this.setError(); 
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }
    
    set currentDate(value){
        this._currentDate = value;
    }
}