function _classCallCheck(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,n){for(var e=0;e<n.length;e++){var o=n[e];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function _createClass(t,n,e){return n&&_defineProperties(t.prototype,n),e&&_defineProperties(t,e),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{pax7:function(t,n,e){"use strict";e.r(n),e.d(n,"BoardModule",(function(){return E}));var o=e("ofXK"),a=e("YUcS"),c=e("tyNb"),i=e("cCzN"),l=e("XNiG"),r=e("1G5W"),d=e("5m3b"),b=e("A09s"),u=e("niqc"),s=e("pA66"),f=e("LcAk"),m=e("fXoL"),h=e("IRfi"),g=e("A2Vd"),p=e("Xlwt"),v=e("3Pt+");function y(t,n){if(1&t){var e=m.Tb();m.Sb(0,"button",9),m.ac("click",(function(){return m.tc(e),m.ec(2).allowEdition()})),m.Bc(1,"Editar Anuncio"),m.Rb()}}function C(t,n){if(1&t){var e=m.Tb();m.Sb(0,"button",10),m.ac("click",(function(){return m.tc(e),m.ec(2).deleteAnnouncement()})),m.Bc(1,"Eliminar Anuncio"),m.Rb()}}function R(t,n){if(1&t){var e=m.Tb();m.Sb(0,"button",10),m.ac("click",(function(){return m.tc(e),m.ec(2).editAnnouncement()})),m.Bc(1,"Confirmar"),m.Rb()}}function M(t,n){if(1&t){var e=m.Tb();m.Sb(0,"div"),m.Sb(1,"div",1),m.Sb(2,"div"),m.Sb(3,"mat-form-field"),m.Sb(4,"input",2),m.ac("ngModelChange",(function(t){return m.tc(e),m.ec().local_data.title=t})),m.Rb(),m.Rb(),m.Sb(5,"mat-form-field"),m.Sb(6,"textarea",3),m.ac("ngModelChange",(function(t){return m.tc(e),m.ec().local_data.body=t})),m.Rb(),m.Rb(),m.Sb(7,"mat-form-field"),m.Sb(8,"input",4),m.ac("ngModelChange",(function(t){return m.tc(e),m.ec().local_data.timestamp=t})),m.Rb(),m.Rb(),m.Rb(),m.Rb(),m.Sb(9,"div",5),m.Sb(10,"button",6),m.ac("click",(function(){return m.tc(e),m.ec().onNoClick()})),m.Bc(11,"Cerrar"),m.Rb(),m.zc(12,y,2,0,"button",7),m.zc(13,C,2,0,"button",8),m.zc(14,R,2,0,"button",8),m.Rb(),m.Rb()}if(2&t){var o=m.ec();m.Ab(4),m.lc("ngModel",o.local_data.title)("readonly",o.isReadOnly),m.Ab(2),m.lc("ngModel",o.local_data.body)("readonly",o.isReadOnly),m.Ab(2),m.lc("ngModel",o.local_data.timestamp),m.Ab(4),m.lc("ngIf",o.isReadOnly),m.Ab(1),m.lc("ngIf",o.isReadOnly),m.Ab(1),m.lc("ngIf",!1===o.isReadOnly)}}function S(t,n){if(1&t){var e=m.Tb();m.Sb(0,"div"),m.Sb(1,"div",1),m.Sb(2,"div"),m.Sb(3,"mat-form-field"),m.Sb(4,"input",11),m.ac("ngModelChange",(function(t){return m.tc(e),m.ec().local_data.title=t})),m.Rb(),m.Rb(),m.Sb(5,"mat-form-field"),m.Sb(6,"textarea",12),m.ac("ngModelChange",(function(t){return m.tc(e),m.ec().local_data.body=t})),m.Rb(),m.Rb(),m.Rb(),m.Rb(),m.Sb(7,"div",5),m.Sb(8,"button",6),m.ac("click",(function(){return m.tc(e),m.ec().onNoClick()})),m.Bc(9,"Cerrar"),m.Rb(),m.Sb(10,"button",9),m.ac("click",(function(){return m.tc(e),m.ec().createAnnouncement()})),m.Bc(11,"Confirmar Anuncio"),m.Rb(),m.Rb(),m.Rb()}if(2&t){var o=m.ec();m.Ab(4),m.lc("ngModel",o.local_data.title),m.Ab(2),m.lc("ngModel",o.local_data.body)}}var A,k=((A=function(){function t(n,e){_classCallCheck(this,t),this.dialogRef=n,this.data=e,this.local_data=Object.assign({},e),this.action=this.local_data.action,"view"===this.action&&(this.isReadOnly=!0,this.local_data.timestamp=this.local_data.timestamp.toDate())}return _createClass(t,[{key:"onNoClick",value:function(){this.dialogRef.close({event:"close"})}},{key:"allowEdition",value:function(){this.isReadOnly=!1}},{key:"editAnnouncement",value:function(){this.dialogRef.close({event:"edit",data:this.local_data})}},{key:"deleteAnnouncement",value:function(){this.dialogRef.close({event:"delete"})}},{key:"createAnnouncement",value:function(){this.dialogRef.close({event:"create",data:this.local_data})}}]),t}()).\u0275fac=function(t){return new(t||A)(m.Mb(f.f),m.Mb(f.a))},A.\u0275cmp=m.Gb({type:A,selectors:[["app-board-dialog"]],decls:2,vars:2,consts:[[4,"ngIf"],["mat-dialog-content",""],["type","text","placeholder","T\xedtulo","matInput","",3,"ngModel","readonly","ngModelChange"],["cols","1","rows","10","placeholder","Cuerpo del Anuncio","matInput","",3,"ngModel","readonly","ngModelChange"],["type","text","placeholder","fecha de creaci\xf3n","matInput","","readonly","",3,"ngModel","ngModelChange"],["mat-dialog-actions",""],["mat-button","",3,"click"],["mat-button","","mat-flat-button","","color","accent",3,"click",4,"ngIf"],["mat-button","","mat-flat-button","","color","warn",3,"click",4,"ngIf"],["mat-button","","mat-flat-button","","color","accent",3,"click"],["mat-button","","mat-flat-button","","color","warn",3,"click"],["type","text","placeholder","T\xedtulo","matInput","",3,"ngModel","ngModelChange"],["cols","1","rows","10","placeholder","Cuerpo del Anuncio","matInput","",3,"ngModel","ngModelChange"]],template:function(t,n){1&t&&(m.zc(0,M,15,8,"div",0),m.zc(1,S,12,2,"div",0)),2&t&&(m.lc("ngIf","view"===n.action),m.Ab(1),m.lc("ngIf","create"===n.action))},directives:[o.m,f.d,h.a,g.b,v.b,v.j,v.m,f.c,p.b],encapsulation:2}),A),w=e("0DX0"),_=e("MSSf"),I=e("XiUz");function x(t,n){if(1&t){var e=m.Tb();m.Sb(0,"div",12),m.Sb(1,"div",13),m.Nb(2,"img",14),m.Rb(),m.Sb(3,"div",15),m.Sb(4,"h4",16),m.Bc(5),m.Sb(6,"small",17),m.Bc(7),m.fc(8,"date"),m.Rb(),m.Rb(),m.Sb(9,"p",17),m.Bc(10),m.fc(11,"slice"),m.Rb(),m.Sb(12,"button",18),m.ac("click",(function(){m.tc(e);var t=n.$implicit,o=n.index;return m.ec().viewAnnouncementBody(t,o)})),m.Bc(13,"ver anuncio completo"),m.Rb(),m.Rb(),m.Rb()}if(2&t){var o=n.$implicit;m.Ab(5),m.Dc("",o.title," "),m.Ab(2),m.Cc(m.gc(8,3,o.timestamp.toDate())),m.Ab(3),m.Cc(o.body.length>50?m.ic(11,5,o.body,0,260)+"..":o.body)}}var O,B,D,P=function(){return{standalone:!0}},z=[{path:"",component:(O=function(){function t(n,e,o,a,c,i){_classCallCheck(this,t),this.dialog=n,this.fetchData=e,this.setData=o,this.deleteData=a,this.holdData=c,this._snackBar=i,this.destroy$=new l.a,this.announcementList=[],this.listOfBacgroundColors=["#ADD8E6","#F5B6C1","#DDBDF1","#90EE90"],this.horizontalPosition="center",this.verticalPosition="bottom"}return _createClass(t,[{key:"ngOnInit",value:function(){this.userId=this.holdData.userId,this.buildingInfo=this.holdData.buildingInfo,this.getAnnouncements()}},{key:"ngOnDestroy",value:function(){this.destroy$.next(),this.destroy$.complete()}},{key:"getAnnouncements",value:function(){var t=this;this.announcementList=[],this.fetchData.getBoardAnnouncements(this.holdData.userInfo.buildingId).pipe(Object(r.a)(this.destroy$)).subscribe((function(n){t.announcementList=n,t.colorBackgroundChange()}))}},{key:"colorBackgroundChange",value:function(){var t=this;this.announcementList.forEach((function(n){var e=Math.floor(Math.random()*t.listOfBacgroundColors.length);n.colorHeader=t.listOfBacgroundColors[e]}))}},{key:"createAnnouncement",value:function(){var t=this,n={title:this.title,body:this.body,timestamp:this.holdData.convertJSDateIntoFirestoreTimestamp()};this.setData.createAnnouncement(this.holdData.userInfo.buildingId,n).then((function(){t._snackBar.open("Anuncio creado exitosamente","Cerrar",{duration:2e3,horizontalPosition:t.horizontalPosition,verticalPosition:t.verticalPosition}),t.title="",t.body="",t.tabGroup.selectedIndex=0}))}},{key:"viewAnnouncementBody",value:function(t,n){var e=this;t.action="view",this.dialog.open(k,{data:t}).afterClosed().subscribe((function(n){var o=n.event;"edit"===o?e.updateAnnouncement(t,{announcementId:t.announcementId,title:n.data.title,body:n.data.body,timestamp:n.data.timestamp}):"delete"===o&&e.deleteAnnouncement(t)}))}},{key:"updateAnnouncement",value:function(t,n){this.setData.updateAnnouncement(this.holdData.userInfo.buildingId,t.announcementId,n)}},{key:"deleteAnnouncement",value:function(t){this.deleteData.deleteAnnouncement(this.holdData.userInfo.buildingId,t.announcementId)}}]),t}(),O.\u0275fac=function(t){return new(t||O)(m.Mb(f.b),m.Mb(d.a),m.Mb(b.a),m.Mb(u.a),m.Mb(s.a),m.Mb(w.a))},O.\u0275cmp=m.Gb({type:O,selectors:[["app-board"]],viewQuery:function(t,n){var e;1&t&&m.Ic(i.b,!0),2&t&&m.qc(e=m.bc())&&(n.tabGroup=e.first)},decls:25,vars:8,consts:[[1,"p-20","bg-info","position-relative"],[1,"card-title","text-white","m-0"],[1,"card-subtitle","text-white","m-0","op-5"],["label","Publicados"],["class","d-flex no-blcok",4,"ngFor","ngForOf"],["label","Crear Anuncio"],[1,"basic-form"],["fxLayout","row wrap"],["fxFlex.gt-sm","100","fxFlex","100"],["matInput","","placeholder","T\xedtulo",3,"ngModel","ngModelOptions","ngModelChange"],["cols","1","rows","10","matInput","","placeholder","Cuerpo del anuncio",3,"ngModel","ngModelOptions","ngModelChange"],["mat-raised-button","","color","primary",3,"click"],[1,"d-flex","no-blcok"],[1,"m-r-20"],["width","50","src","assets/images/newspaper.png","alt","Image",1,"img-circle"],[1,"p-b-20","b-b","m-b-30"],[1,"m-0"],[1,"text-muted"],["mat-button","",3,"click"]],template:function(t,n){1&t&&(m.Sb(0,"mat-card"),m.Sb(1,"div",0),m.Sb(2,"h4",1),m.Bc(3,"Anuncios"),m.Rb(),m.Sb(4,"h6",2),m.Bc(5),m.Rb(),m.Rb(),m.Sb(6,"mat-tab-group"),m.Sb(7,"mat-tab",3),m.Sb(8,"mat-card-content"),m.zc(9,x,14,9,"div",4),m.Rb(),m.Rb(),m.Sb(10,"mat-tab",5),m.Sb(11,"mat-card-content"),m.Sb(12,"mat-card-title"),m.Bc(13,"Crear Anuncio"),m.Rb(),m.Sb(14,"form",6),m.Sb(15,"div",7),m.Sb(16,"div",8),m.Sb(17,"mat-form-field"),m.Sb(18,"input",9),m.ac("ngModelChange",(function(t){return n.title=t})),m.Rb(),m.Rb(),m.Rb(),m.Sb(19,"div",8),m.Sb(20,"mat-form-field"),m.Sb(21,"textarea",10),m.ac("ngModelChange",(function(t){return n.body=t})),m.Rb(),m.Rb(),m.Rb(),m.Sb(22,"div",8),m.Sb(23,"button",11),m.ac("click",(function(){return n.createAnnouncement()})),m.Bc(24,"Publicar"),m.Rb(),m.Rb(),m.Rb(),m.Rb(),m.Rb(),m.Rb(),m.Rb(),m.Rb()),2&t&&(m.Ab(5),m.Dc("Estos son los anuncios publicados para la comunidad ",n.buildingInfo.name,""),m.Ab(4),m.lc("ngForOf",n.announcementList),m.Ab(9),m.lc("ngModel",n.title)("ngModelOptions",m.nc(6,P)),m.Ab(3),m.lc("ngModel",n.body)("ngModelOptions",m.nc(7,P)))},directives:[_.a,i.b,i.a,_.c,o.l,_.h,v.q,v.k,v.l,I.c,I.a,h.a,g.b,v.b,v.j,v.m,p.b],pipes:[o.f,o.u],styles:[".first-button[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-bottom:30px}.main-content[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap}.card[_ngcontent-%COMP%]{max-width:30%;min-width:30%;max-height:40%}.header[_ngcontent-%COMP%]{display:flex;justify-content:flex-end}.content[_ngcontent-%COMP%]{border-bottom:.2px solid #c9c8c7;margin-bottom:0}.buttons[_ngcontent-%COMP%], .content[_ngcontent-%COMP%]{display:flex;justify-content:center}.buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin-bottom:10px}.content[_ngcontent-%COMP%], .truncate[_ngcontent-%COMP%]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.content[_ngcontent-%COMP%]{width:100%}"]}),O)}],T=((B=function t(){_classCallCheck(this,t)}).\u0275mod=m.Kb({type:B}),B.\u0275inj=m.Jb({factory:function(t){return new(t||B)},imports:[[c.i.forChild(z)],c.i]}),B),j=e("onrN"),E=((D=function t(){_classCallCheck(this,t)}).\u0275mod=m.Kb({type:D}),D.\u0275inj=m.Jb({factory:function(t){return new(t||D)},imports:[[o.c,T,j.a,a.a,v.f]]}),D)}}]);