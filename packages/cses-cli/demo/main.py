n = int(input())
b = [n]
from time import sleep
import random
sleep(random.uniform(0.7, 1.1))
while n != 1:
	if n % 2 == 0:
		n /= 2
		b.append(int(n))
	else:
		n = int(n*3 + 1)
		b.append(n)
print(*b)
