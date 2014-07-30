import datetime;
import time
#from datetime import datetime;

def incrementOneDay( d ):
	date = datetime.datetime.strptime(str(d), "%Y%m%d%H%M%S");
	date += datetime.timedelta(days=1);
	return date.strftime("%Y%m%d%H%M%S");

def decrementDay( d, interval ):
	date = datetime.datetime.strptime(str(d), "%Y%m%d%H%M%S");
	date += datetime.timedelta(days=interval);
	return date.strftime("%Y%m%d%H%M%S");

startTime = time.time();
data = 20090125000000;

for i in range(100):
	print(data);
	data = decrementDay( data, -3 );

endTime = time.time() - startTime;
print(endTime);