import { z } from "zod";
import { procedure, router } from "../trpc";
import { prisma } from "../prisma";
import PouchDB from 'pouchdb'

const db = new PouchDB('MyDb');
const remote = new PouchDB('http://127.0.0.1:4000/kittens');

// db.info().then(function(info) {
//   console.log(info);
// })

remote.info().then(function(info) {
  console.log('remote', info);
})

// const doc = {
//   "_id": "mittens",
//   "name": "Mittens",
//   "occupation": "kitten",
//   "age": 3,
//   "hobbies": [
//     "playing with balls of yarn",
//     "chasing laser pointers",
//     "lookin' hella cute"
//   ]
// };

// db.put(doc);

db.get('mittens').then(function(doc) {
  console.log(doc);
});

remote.get('mittens').then(function(doc) {
  console.log(doc, 'what');
});

db.sync(remote, {
  live: true
}).on('change', function(change) {
  console.log('updated', change);
}).on('error', function(err) {
  console.log(err)
});


// var rep = PouchDB.replicate(remote, db, {
//   live: true,
//   // retry: true
// }).on('change', function(info) {
//   console.log('change:', info);
// }).on('paused', function() {
//   console.log('I am Paused');
//   // replication paused (e.g. user went offline)
// }).on('active', function() {
//   console.log('I am Active!!');
// }).on('denied', function(info) {
//   console.log('Denied!!', info);
//   // a document failed to replicate, e.g. due to permissions
// }).on('complete', function(info) {
//   console.log('Completed');
//   // handle complete
// }).on('error', function(err) {
//   console.log('Error:', err);
//   // handle error
// });

// console.log(rep)


export default router({
  getAll: procedure.query(() => {
    return prisma.post.findMany();
  }),

  create: procedure
    .input(z.object({
      title: z.string().max(32),
      description: z.string().max(64),
    }))
    .mutation(({ input }) => {
      return prisma.post.create({ data: input });
    }),
  delete: procedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(({ input }) => {
      return prisma.post.delete({ where: { id: input.id } });
    }),
});



