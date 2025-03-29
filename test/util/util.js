import bcrypt from 'bcrypt';

const createPassword = async (password) => {
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	return hashedPassword
}

var password = prompt('What is your password?');
console.log(`Generated password: ${await createPassword(password)}`);
