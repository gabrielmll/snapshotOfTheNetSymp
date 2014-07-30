#	This script aims the following:
# - Choose a threshold time to go back in the past (eg.: 7 days)
# : Show me the intereactions between this guys and everyone in the last X days from picked time.
# : Also give how many symptoms each node had in the last X days

import csv		# imports the csv module
import sys      # imports the sys module
import datetime, time

# Function to increment one day
def incrementOneDay( d ):
	date = datetime.datetime.strptime(str(d), "%Y%m%d%H%M%S");
	date += datetime.timedelta(days=1);
	return date.strftime("%Y%m%d%H%M%S");

# Function to decrement "interval" day(s)
def decrementDay( d, interval ):
	date = datetime.datetime.strptime(str(d), "%Y%m%d%H%M%S");
	date += datetime.timedelta(days=interval);
	return date.strftime("%Y%m%d%H%M%S");

# This is to measure the running time. It has nothing to do with the whole algorithm
startTime = time.time()

# Important Variables
current_day = 20090109000000;
historical_threshold = -3;
k = 1;
while long(current_day) != 20090425000000:
	f = open(sys.argv[1], 'rb'); # opens the csv file
	outputFile = "data\hist_prox_weight"+str(k)+".csv";
	#outputFile = "data\\" + str(current_day)[:8] + ".csv";
	beginning_interval = decrementDay (current_day, historical_threshold);
	print "------------------";
	print "Day "+str(k);
	print outputFile;
	print str(beginning_interval)+" - "+str(current_day);
	try:
		with open('historical_proximity.csv', 'wb') as fp:
			w = csv.writer(fp, delimiter=',')

			reader = csv.reader(f)  # creates the csv reader object
			#w.writerows([next(reader)]) # Writing the header (I'm not using to give another name for header)
			w.writerows([['source','target','time','prob2']])
			next(reader, None)  # skip the headers
			
			for row in reader:   # iterates the rows of the file in orders
				try:
					date = long(row[2].replace("-", "").replace(":", "").replace(" ", ""))
				except ValueError,e:
					print "error",e,"on line",row

				if date >= long(beginning_interval) and date <= long(current_day):	# clock precision
					#print row[2][0:10].replace("-", "")    # prints each row
					#print row
					#print date
					w.writerows([row])
					#if long(row[0]) == 57 or long(row[1]) == 57:
						#print row
						#w.writerows([row])
	finally:
		f.close()      # closing

	#
	# HERE IS GETTING THE SYMPTOMS
	#
	binSymptom = [str('0000')] * 81;
	binPsychSymp = [str('00')] * 81;
	#print binSymptom;
	f = open("FluSymptoms.csv", 'rb') # opens the csv file
	try:
		reader = csv.reader(f)  # creates the csv reader object
		next(reader, None)  # skip the headers

		for row in reader:   # iterates the rows of the file in orders
			try:
				date = long(row[1].replace("-", "").replace(":", "").replace(" ", ""))
			except ValueError,e:
				print "error",e,"on line",row

			if date >= long(beginning_interval) and date <= long(current_day):	# clock precision
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
				if binPsychSymp[int(row[0])][0] == '0' and row[6] == '1':
					binPsychSymp[int(row[0])] = "1" + binPsychSymp[int(row[0])][1:];
				if binPsychSymp[int(row[0])][1] == '0' and row[7] == '1':
					binPsychSymp[int(row[0])] = binPsychSymp[int(row[0])][0] + "1";

	finally:
		f.close()      # closing

	f = open('historical_proximity.csv', 'rb'); # opens the csv file
	# subject1[index] interacts with subject2[index] with weight[index]
	subject1 = [1];	# init with 1 to be able to do a loop
	subject2 = [1];	# init with 1 to be able to do a loop
	weight = [0];	# init with 0 to be able to do a loop
	try:
		with open(outputFile, 'wb') as fp:
			w = csv.writer(fp, delimiter=',');
			
			reader = csv.reader(f);
			w.writerows([['source','target','weight', 'symptom', 'psych_symp']]);
			next(reader, None);
			
			for i in range(1, 81):
				person = str(i)
				w.writerows([[person, person, 'NaN', binSymptom[i], binPsychSymp[i]]])	# creating everyone whithout intereactions
			
			for row in reader:
				sub1 = min([int(row[0]), int(row[1])]);	# Get min id subject in the row
				sub2 = max([int(row[0]), int(row[1])]);	# Get max id subject in the row
				flagToExistence = False;
				#print "Check for: ", row, row[0], row[1], sub1, sub2;
				for i in range(len(subject1)):	# Loop over subject1
					if subject1[i] == int(sub1) and subject2[i] == int(sub2):	# check if sub1 and sub2 are already in the list
						#print "Exists: ", sub1, sub2;
						weight[i] = weight[i] + 1;
						flagToExistence = True;
				if flagToExistence is False:
					#print "Append: ", sub1, sub2;
					subject1.append(int(sub1));
					subject2.append(int(sub2));
					weight.append(1);
			subject1.pop(0);
			subject2.pop(0);
			weight.pop(0);
			for i in range(len(subject1)):
				#print subject1[i], subject2[i], weight[i];
				w.writerow([subject1[i], subject2[i], weight[i], 'NaN', 'NaN']);
	finally:
		f.close()      # closing
	k = k+1;
	current_day = incrementOneDay( current_day );

# This is to measure the running time. It has nothing to do with the whole algorithm
endTime = time.time() - startTime;
print(endTime);