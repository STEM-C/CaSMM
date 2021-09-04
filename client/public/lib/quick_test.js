//inline comment
Blockly.Arduino.insert_comment = function(a) {
    var b;
    var x;
    if (0 == a.itemCount_) return "// \n";
    if (1 == a.itemCount_) {
        x = (Blockly.Arduino.valueToCode(a, "ADD0", Blockly.Arduino.ORDER_UNARY_POSTFIX) || '');
        x = x.slice(0,-1);
        x = x.substring(1);
        return "// " + x + "\n";
    }
    var c;
    b = [];
    for (var d = 0; d < a.itemCount_; d++){
        c = Blockly.Arduino.valueToCode(a, "ADD" + d, Blockly.Arduino.ORDER_NONE);
        c = c.slice(0,-1);
        c = c.substring(1);
        b[d] = "" == c ? '' : "// " + c + "\n";
        }
    b = b.join("");
    return b;
};

//block comment
Blockly.Arduino.block_comment = function(a) {
    var b = Blockly.Arduino.statementToCode(a, 'comment');
    return "/* " + a.getFieldValue("comment_input") + "\n" + b + "*/\n";
};

//block comment
Blockly.Blocks.block_comment= {
    init: function() {
      this.appendDummyInput()
          .appendField("/*")
          .appendField(new Blockly.FieldTextInput("Block comment"), "comment_input");
      this.appendStatementInput("comment")
          .setCheck(null)
          .appendField("*/");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.texts.HUE);
      this.setTooltip(Blockly.Msg.BLOCK_COMMENT_TIP);
      this.setHelpUrl("https://www.arduino.cc/reference/tr/language/structure/further-syntax/blockcomment/");
    }
  };
  
  Blockly.Blocks.insert_comment={
    init:function(){
      this.setHelpUrl(Blockly.Msg.COMMENT);
      this.setColour(Blockly.Blocks.texts.HUE);
      this.setPreviousStatement(!0);
      this.setNextStatement(!0);
      this.itemCount_=1;
      this.updateShape_();
      this.setMutator(new Blockly.Mutator(["comment_join_item"]));
      this.setTooltip(Blockly.Msg.COMMENT_TIP)}
    ,mutationToDom:
      function(){
        var a=document.createElement("mutation");
        a.setAttribute("items",this.itemCount_);
        return a}
    ,domToMutation:
      function(a){
        this.itemCount_=parseInt(a.getAttribute("items"),10);
        this.updateShape_()}
    ,decompose:
      function(a){
        var b=a.newBlock("comment_join_container");
        b.initSvg();
        for(var c=b.getInput("STACK").connection,d=0;d<this.itemCount_;d++){
          var e=a.newBlock("comment_join_item");
          e.initSvg();
          c.connect(e.previousConnection);
          c=e.nextConnection
        }
        return b
      }
    ,compose:
      function(a){
        var b=a.getInputTargetBlock("STACK");
        for(a=[];b;)
        a.push(b.valueConnection_),b=b.nextConnection&&b.nextConnection.targetBlock();
        for(b=0;b<this.itemCount_;b++){
          var c=this.getInput("ADD"+b).connection.targetConnection;
          c&&-1==a.indexOf(c)&&c.disconnect()
        }
        this.itemCount_=a.length;
        this.updateShape_();
        for(b=0;b<this.itemCount_;b++)
        Blockly.Mutator.reconnect(a[b],this,"ADD"+b)
      }
    ,saveConnections:
      function(a){
        a=a.getInputTargetBlock("STACK");
        for(var b=0;a;){
          var c=this.getInput("ADD"+b);
          a.valueConnection_=c&&c.connection.targetConnection;
          b++;
          a=a.nextConnection&&a.nextConnection.targetBlock()
        }
      }
    ,updateShape_:
      function(){
        this.itemCount_&&this.getInput("EMPTY")?this.removeInput("EMPTY"):this.itemCount_
        ||this.getInput("EMPTY")
        ||this.appendDummyInput("EMPTY")
                .appendField(this.newQuote_(!0))
                .appendField(this.newQuote_(!1));
        for(var a=0;a<this.itemCount_;a++)
          if(!this.getInput("ADD"+a)){
            var b=this.appendValueInput("ADD"+a);
            0==a&&b.appendField(Blockly.Msg.COMMENT_CREATEWITH)}
        for(;this.getInput("ADD"+a);)
          this.removeInput("ADD"+a),a++
      }
    ,newQuote_:
    Blockly.Blocks.text.newQuote_
    ,getBlockType:
      function(){
        return Blockly.Types.TEXT
      }
  };
  
  Blockly.Blocks.comment_join_container={
    init:function(){
      this.setColour(Blockly.Blocks.texts.HUE);
      this.appendDummyInput()
          .appendField("");
      this.appendStatementInput("STACK");
      this.setTooltip(Blockly.Msg.COMMENT_CREATE_JOIN_TOOLTIP);
      this.contextMenu=!1}};
      
  Blockly.Blocks.comment_join_item={
    init:function(){this.setColour(Blockly.Blocks.texts.HUE);
      this.appendDummyInput()
          .appendField("Comment")
      this.setPreviousStatement(!0);
      this.setNextStatement(!0);
      this.setTooltip(Blockly.Msg.COMMENT_JOIN_ITEM_TOOLTIP);
      this.contextMenu=!1}
    };