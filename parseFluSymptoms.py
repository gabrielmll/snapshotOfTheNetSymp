#	This is a parse for network graph per interval of time
# for flu Symptons data

import csv		# imports the csv module
import sys      # imports the sys module
import datetime, time

binSymptom = [str('0000')] * 81;
#print binSymptom;
f = open(sys.argv[1], 'rb') # opens the csv file
try:
	reader = csv.reader(f)  # creates the csv reader object
	next(reader, None)  # skip the headers

	for row in reader:   # iterates the rows of the file in orders
		try:
			date = long(row[1].replace("-", "").replace(":", "").replace(" ", ""))
		except ValueError,e:
			print "error",e,"on line",row

		if date >= 20090223090000 and date <= 20090226090000:	# clock precision
			#print row[2][0:10].replace("-", "")    # prints each row
			#print date
			#w.writerows([row])
			if binSymptom[int(row[0])][0] == '0' and row[2] == '1':
				binSymptom[int(row[0])] = "1" + binSymptom[int(row[0])][1:];
			if binSymptom[int(row[0])][1] == '0' and row[3] == '1':
				binSymptom[int(row[0])] = binSymptom[int(row[0])][0] + "1" + binSymptom[int(row[0])][2:];
			if binSymptom[int(row[0])][2] == '0' and row[4] == '1':
				binSymptom[int(row[0])] = binSymptom[int(row[0])][:2] + "1" + binSymptom[int(row[0])][3];
			if binSymptom[int(row[0])][3] == '0' and row[5] == '1':
				binSymptom[int(row[0])] = binSymptom[int(row[0])][:3] + "1";
				
			print row[0];
			print binSymptom[int(row[0])];
			print row[2]+row[3]+row[4]+row[5];
			print "-"
			
	print len(binSymptom); # Must pop first

finally:
	f.close()      # closing