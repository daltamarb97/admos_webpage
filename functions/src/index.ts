import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as nodemailer from 'nodemailer'

admin.initializeApp(functions.config().firebase);


const SENDER_EMAIL= 'waypooltec@gmail.com';
const SENDER_PASSWORD= 'Waypooltec2020';


exports.sendPaymentEmailNotification = functions.firestore
    .document('payment_tables/{buildingId}/rows_data/{rowId}')
    .onUpdate((change, context)=>{
        
        const snapshot = change.after.data();

        if(snapshot){
            const rceiverInfoEmail = snapshot.email;
            const manualEmailConf = snapshot.manualEmail;

            if(manualEmailConf === true){
                
                // email Logic stated here
                const authData = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: SENDER_EMAIL,
                        pass: SENDER_PASSWORD
                    }
                });


                authData.sendMail({
                    from: 'info@adpool.com',
                    to: rceiverInfoEmail,
                    subject: 'Atraso con pagos de administración',
                    text: 'Te recordamos quue tienes un saldo pendiente de xxxxx que no ha sido pagado por concepto de cuota de administración del edificio xxxx. Favor pagar lo antes psible'
                }).then((res)=>{
                    console.log('successfully sent email:' + res);
                }).catch(error =>{
                    console.log('error has raised and it is: ' + error); 
                });

                //ALERTTTTTTTTTT
                // DELETE SETTIMEOUT FROM setFirestoreTriggerPaymentEmail FUNCTION IN SET-DATA.SERVICE.TS AND
                // SET manualEmail PROPERTY TO FALSE HERE WHEN DEPLOY
                ////////
            }else{
                console.log('the update has nothing to do with email sending');
            }   
        }
    })