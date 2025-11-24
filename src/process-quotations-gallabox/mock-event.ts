export const mockEvent = {
  Records: [
    {
      messageId: "14863e20-c7e6-4324-99a2-d826783b817f",
      receiptHandle:
        "AQEBQnzjDnILDlCyETK39xaKcyXZrCM4GmgHeeBK9khPrMMnMh49ZkTU+7ZP5zyajW9DU7qyAIwYhP8Cm71dEROjKX/6o6oxBoVmMbpOgBHsiRGBqPVEEoY45gZF08zCp3w09qH9oYStXw2l1hJUcXlErtmPwWFnYe8q+no4sI7pBOQkw/8lFuuGkJNsVzLpVivCBO/x+z3+ofxV/lhm5vywJ9inx1q7YYi13Jyk5SKH5+8TxqB2OoN8jV/Vo2hoWCATp9TU1Qw0bkr/KIXJIX8DFNcC6s1oI8tJZve07pHPzpZwbt6GjuDNY9maqWcywzyd38GZELPkOWX3nYga8VhrACUw+nyxRrNedz2pYlGcXh3ErPtwL2lce3bk4cOMQVTfYG3FUogApr6rdiEtoiCg7zMugISvD3/zayCiFIyXTfw=",
      body: '{"version":"0","id":"f327b087-cdb6-3207-1905-dae150dee3db","detail-type":"track","source":"aws.partner/segment.com/nmBPqyPa5wBXUTRX87DwWd","account":"366146806243","time":"2025-04-08T19:55:41Z","region":"us-east-2","resources":["identifiedUser/cb29e258426a7bc87452f147b64c0be0be4d9a33"],"detail":{"event":"quotation_generated","timestamp":"2025-04-08T19:55:38.540Z","version":2,"properties":{"quotation_id":"LVA68607E94719480E9C51833304A9A752","seller_id":19},"projectId":"nmBPqyPa5wBXUTRX87DwWd","messageId":"api-2vScujEMpSBuY0yLFHSLUz21jbu","integrations":{},"context":{"library":{"name":"unknown","version":"unknown"}},"channel":"server","receivedAt":"2025-04-08T19:55:38.540Z","userId":"cb29e258426a7bc87452f147b64c0be0be4d9a33","type":"track"}}',
      attributes: {
        ApproximateReceiveCount: "5",
        SentTimestamp: "1744142141253",
        SenderId: "AROAVKQAM4HRUZTXVSHHC:ad463aa1eff93ffb9b29b758f04cd0f1",
        ApproximateFirstReceiveTimestamp: "1744142161253",
      },
      messageAttributes: {},
      md5OfBody: "e77499a027487f74cd2a0a4abf811da8",
      eventSource: "aws:sqs",
      eventSourceARN:
        "arn:aws:sqs:us-east-2:366146806243:quotation-gallabox-queue-dev",
      awsRegion: "us-east-2",
    },
  ],
};
