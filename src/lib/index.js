// run `node index.js` in the terminal
const Axios = require('axios');

const test = async () => {
  Axios.get(
    `https://greenstarstorage.sandbox.signicat.com/auth/rest/sessions/3db3f6d3-b4d5-a54a-9c8a-8883b50f72b8/?signicat-accountId=a-spge-UL9Y3JklVdUW3XXNn7vR`,
    {
      headers: {
        Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6InNhbmRib3gtc2lnbmluZy1rZXktYTEyYWRlMDBmMTUzOTk0NWE3OTYwMjQ2ZWM1MjkwNDUiLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE2Njk5MTExNzgsImV4cCI6MTY2OTkxMTc3OCwiaXNzIjoiaHR0cHM6Ly9hcGkuc2lnbmljYXQuY29tL2F1dGgvb3BlbiIsImF1ZCI6Imh0dHBzOi8vYXBpLnNpZ25pY2F0LmNvbSIsImNsaWVudF9pZCI6InNhbmRib3gtZ2xhbW9yb3VzLWNsb2NrLTU1OSIsImFjY291bnRfaWQiOiJhLXNwZ2UtVUw5WTNKa2xWZFVXM1hYTm43dlIiLCJqdGkiOiJFQkM2MDYxN0U4MUZDNTU2Q0ZFMjk3NTkwMENCRTBBOCIsImlhdCI6MTY2OTkxMTE3OCwic2FuZGJveCI6dHJ1ZSwic2NvcGUiOlsic2lnbmljYXQtYXBpIl19.Z_PpP_UrES4ubRg_3YXD2LIZs5LtlKrm_6asuurGzqrd4bQtTgA9FZQFre5uvsy2VGnF_pSHR4Um0DMiNo5azRmlvAhIo9U0KcxWXrv8Dgo4U6aw9F_62T3RCsj2yhSUXx0LXNCg4vxcpL1qHMLpSEU843qAx7OyvCNXC813a8YrEMbsm91dvQ0ZFIiK3OVBmhag698U2vLGjdzzxNgfaGBVc64yGxcmRAIiGQw6ZqXQ347U7iYf3B1akVBMlMIvUIXsu0J5pwGZCkDwpb2CBWUCw82ULBaemqsJWBsoOh114kyca0pgLG_PwBucqbsRcjOp98f2y4iVgHApnmHDRw`,
        Host: "api.signicat.com"
      },
    }
  )
    .then((response) => {
      console.log(response.data.subject);
    })
    .catch((err) => {
      console.log(err.stack);
    });
};

test();
