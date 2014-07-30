#	This script aims the following:
# - Choose a threshold time to go back in the past (eg.: 7 days)
# - Choose a guy
# : Show me the intereactions between this guys and everyone in the last X days from picked time

import csv		# imports the csv module
import sys      # imports the sys module
import datetime, time

f = open(sys.argv[1], 'rb') # opens the csv file
list = [];
try:
	with open('historical_proximity.csv', 'wb') as fp:
		w = csv.writer(fp, delimiter=',')

		reader = csv.reader(f)  # creates the csv reader object
		#w.writerows([next(reader)]) # Writing the header (I'm not using to give another name for header)
		w.writerows([['source','target','time','prob2']])
		next(reader, None)  # skip the headers

		for row in reader:   # iterates the rows of the file in orders
			if int(row[0]) not in list:
				list.append(int(row[0]));
			#if int(row[1]) not in list:
				#list.append(int(row[1]));
		list.sort();
		print list;
		print len(list);
finally:
	f.close()      # closing