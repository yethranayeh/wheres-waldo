/** @format */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBO3aFcqk2ktThpP72_6nExYRxNwyBU9_0",
	authDomain: "wheres-waldo-b1e90.firebaseapp.com",
	projectId: "wheres-waldo-b1e90",
	storageBucket: "wheres-waldo-b1e90.appspot.com",
	messagingSenderId: "794861590290",
	appId: "1:794861590290:web:737d577f0dec9069dc45cb"
};

initializeApp(firebaseConfig);
export const db = getFirestore();
