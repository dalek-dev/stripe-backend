import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import {userAuth} from './middleware';

const app:Application = express();

app.use(cors());
app.use(bodyParser.json());
const stripe = new Stripe("sk_test_51HKz2BK1xkU5qMWgTgHy87oWwQGsoqdBX4SG19BTTCoofAX8YSsSzKVURnvIdfkGmJqtUkJNwjapIcpTRKUhYoEB00lEVZJmZb",{
    apiVersion: "2020-08-27"
});

app.get('/', (req:Request, res: Response) => {
    res.send("Hola man!!");
    
});

app.post(
    "/create-payment-intent",
    userAuth,
    async (req:Request, res: Response) => {
        try{
            const amount = req.body.amount as number;
            const intent:Stripe.PaymentIntent = await stripe.paymentIntents.create({
                amount,//centavos
                currency: "usd",
                metadata:{
                    userId: 12,
                    productId: 1293,
                }
            });
            res.send({
                id:intent.id, 
                clientSecret: intent.client_secret, 
            });
        }catch (e){
            res.status(500).send(e.message); 
        }
    });

app.post(
    "/check-payment-status",
    userAuth,
    async (req:Request, res: Response) => {
        try{
            const paymentIntentId = req.body.paymentIntentId as string;
            if(!paymentIntentId || paymentIntentId.trim().length==0){
                throw new Error("invalid param paymentItentId");   
            }
            const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
            console.log("intent", intent);
            res.send({status: intent.status});
        }catch (e){
            res.status(500).send(e.message); 
        }
    });

app.listen(4000, ()=>{
    console.log("running");
});