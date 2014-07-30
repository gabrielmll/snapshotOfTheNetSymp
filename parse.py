#	This is a parse for network graph per interval of time
# which means who had interecation during that moment

import csv		# imports the csv module
import sys      # imports the sys module
import datetime, time

f = open(sys.argv[1], 'rb') # opens the csv file
try:
	with open('proximity2.csv', 'wb') as fp:
		w = csv.writer(fp, delimiter=',')

		reader = csv.reader(f)  # creates the csv reader object
		#w.writerows([next(reader)]) # Writing the header (I'm not using to give another name for header)
		w.writerows([['source','target','time','prob2']])
		next(reader, None)  # skip the headers

		for i in range(1, 81):
			person = str(i)
			w.writerows([[person, person, 'NaN', 'NaN']])
		for row in reader:   # iterates the rows of the file in orders
			try:
				#date = float(row[2][0:10].replace("-", ""))
				date = long(row[2].replace("-", "").replace(":", "").replace(" ", ""))
			except ValueError,e:
				print "error",e,"on line",row

			#if date >= 20090109 and date <= 20090222: # Date referent to survey interval
			#if date == 20090109: # one day
			if date >= 20090109080000 and date <= 20090109090000:	# clock precision
				#print row[2][0:10].replace("-", "")    # prints each row
				#print row
				#print date
				w.writerows([row])

finally:
	f.close()      # closing