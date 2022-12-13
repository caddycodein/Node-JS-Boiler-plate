class CommonResponse{
    public readonly status: number;

    public readonly message: string;

    public readonly description: string;

    public readonly body: any;

    constructor(status: number, message: string, description: string, body: any) {
        this.status = status;
        this.message = message;
        this.description = description;
        this.body = body;
    }
}

export default CommonResponse;