import twilio, {Twilio} from "twilio";
/*export class TwilioAdapter {
    private accountSid: string
    private authToken: string
    private client: Twilio
    constructor() {
        this.accountSid = process.env.TWILIO_ACCOUNT_SID as string
        this.authToken = process.env.TWILIO_AUTH_TOKEN as string
        this.client = twilio(this.accountSid, this.authToken)
    }
    async sendMessage(to: string, message: string) {
        const { status } = await this.client.messages
          .create({
             body: message,
             from: process.env.TWILIO_NUMBER,
             to: '+244931149487'
           })
        return status

    }

}*/


export const TwilioAdapter = {
    accountSid: null as unknown as  string,
    authToken: null as unknown as string,
    client: null as unknown as Twilio,
    init() {
        this.accountSid = process.env.TWILIO_ACCOUNT_SID as string
        this.authToken = process.env.TWILIO_AUTH_TOKEN as string
        this.client = twilio(this.accountSid, this.authToken)
    },
    async sendMessage(message: string) {


        try {
            const result = await this.client.messages
                  .create({
                     body: message,
                     from: process.env.TWILIO_NUMBER,
                     to: '+244931149487'
                   })
                return result.status
        } catch (error) {

        }




    }
}
