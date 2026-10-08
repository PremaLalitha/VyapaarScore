const { parseTransactionText } = require('./utils/ocrParser');

const testText = "To ARBIND KUMAR +91 87098 08668 325,000.00 For construction O Completed * Sep 23, 4:30 PM UCO Bank 7 XXXXXXXXXX6850 UPI transaction ID 126619733470 To: PRITI KUMARI arbbgp@oksbi From: DHIRAJ KUMAR KESHRI (UCO Bank) dkkbgp12@okaxis Google transaction ID CICAgODg2qxK POWERE Li=mw G Pay";

const result = parseTransactionText(testText);
console.log('--- TEST PARSING RESULT ---');
console.log(JSON.stringify(result, null, 2));
