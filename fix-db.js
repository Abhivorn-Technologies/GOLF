const { MongoClient, ObjectId } = require('mongodb');

async function run() {
  const client = new MongoClient('mongodb://poojithamandha_db_user:wELjTNtacf5LItxZ@ac-arqlp0t-shard-00-00.h47tslx.mongodb.net:27017,ac-arqlp0t-shard-00-01.h47tslx.mongodb.net:27017,ac-arqlp0t-shard-00-02.h47tslx.mongodb.net:27017/golf-ecom?ssl=true&replicaSet=atlas-167gvd-shard-0&authSource=admin&retryWrites=true&w=majority');
  await client.connect();
  const db = client.db('golf-ecom');
  
  await db.collection('banners').updateOne(
    { _id: new ObjectId('6a96babfec9dc8ee29b34b90') },
    { $set: { 
        title: '<p style="text-align: left;"><span style="color: rgb(44, 42, 42); font-family: &quot;Times New Roman&quot;, serif;"><strong><em><u>HELLOW EVERYONE!😍</u></em></strong></span></p>',
        subtitle: '<p><span style="color: rgb(10, 10, 10); font-family: Georgia, serif;"><strong>Wellcome to </strong></span><span style="color: rgb(171, 38, 38); font-family: Georgia, serif;"><strong>Golf</strong></span></p>'
      }
    }
  );
  
  console.log('Updated DB');
  await client.close();
}

run();
