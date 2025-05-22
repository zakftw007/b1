// import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// const db = getFirestore();

// export async function saveUserExpenseGoal(goalAmount: number) {
//   const user = getAuth().currentUser;
//   if (!user) throw new Error('User not logged in');

//   const userDoc = doc(db, 'users', user.uid);

//   await setDoc(userDoc, { expenseGoal: goalAmount }, { merge: true });
// }

// export async function getUserExpenseGoal() {
//   const user = getAuth().currentUser;
//   if (!user) throw new Error('User not logged in');

//   const userDoc = doc(db, 'users', user.uid);
//   const docSnap = await getDoc(userDoc);

//   if (docSnap.exists()) {
//     return docSnap.data().expenseGoal;
//   } else {
//     return null;
//   }
// }