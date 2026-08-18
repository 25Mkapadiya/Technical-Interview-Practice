(function () {
  'use strict';

  const suites = [
    {
      re: /count all digits|count digits/i,
      input: 'One non-negative integer n.', output: 'Print the number of decimal digits in n.',
      tests: [['Zero', '0', '1'], ['Basic', '12345', '5'], ['Power of ten', '100000', '6']]
    },
    {
      re: /reverse a number|reverse integer/i,
      input: 'One integer n.', output: 'Print n with its decimal digits reversed. Preserve a leading minus sign and discard leading zeroes in the reversed magnitude.',
      tests: [['Basic', '12345', '54321'], ['Trailing zeroes', '1200', '21'], ['Negative', '-507', '-705']]
    },
    {
      re: /palindrome number/i,
      input: 'One integer n.', output: 'Print true if n reads the same forward and backward, otherwise false.',
      tests: [b('Positive', '121', 'true'), b('Negative', '-121', 'false'), b('Single digit', '7', 'true')]
    },
    {
      re: /gcd of two numbers|greatest common divisor/i,
      input: 'Two integers a and b on one line.', output: 'Print gcd(a, b) as a non-negative integer.',
      tests: [['Common factor', '48 18', '6'], ['Coprime', '17 13', '1'], ['Includes zero', '0 9', '9']]
    },
    {
      re: /check for prime|prime number/i,
      input: 'One integer n.', output: 'Print true if n is prime, otherwise false.',
      tests: [b('Prime', '29', 'true'), b('Composite', '35', 'false'), b('One', '1', 'false'), b('Two', '2', 'true')]
    },
    {
      re: /largest.*element.*array|largest element/i,
      input: 'First line n. Second line: n integers.', output: 'Print the maximum element.',
      tests: [['Mixed', '5\n2 5 1 8 3', '8'], ['All negative', '4\n-9 -2 -7 -4', '-2'], ['Single', '1\n42', '42'], ['Duplicates', '5\n7 7 7 7 7', '7']]
    },
    {
      re: /second.*largest/i,
      input: 'First line n. Second line: n integers. There are at least two distinct values.', output: 'Print the second distinct largest value.',
      tests: [['Duplicates at max', '5\n1 2 4 7 7', '4'], ['Negative', '4\n-5 -1 -3 -2', '-2'], ['Two values', '4\n3 3 1 1', '1']]
    },
    {
      re: /check if.*array.*sorted|check.*sorted/i,
      input: 'First line n. Second line: n integers.', output: 'Print true if the array is non-decreasing, otherwise false.',
      tests: [b('Sorted', '5\n1 2 2 4 9', 'true'), b('Not sorted', '4\n1 3 2 4', 'false'), b('Single', '1\n8', 'true')]
    },
    {
      re: /move.*zero/i,
      input: 'First line n. Second line: n integers.', output: 'Print the transformed array with non-zero values in original order followed by zeroes, separated by spaces.',
      tests: [t('Mixed', '5\n0 1 0 3 12', '1 3 12 0 0'), t('No zero', '3\n1 2 3', '1 2 3'), t('All zero', '4\n0 0 0 0', '0 0 0 0'), t('Leading/trailing', '6\n0 4 0 0 2 0', '4 2 0 0 0 0')]
    },
    {
      re: /linear search/i,
      input: 'First line n. Second line: n integers. Third line: target.', output: 'Print the first zero-based index of target, or -1 when absent.',
      tests: [['Found', '5\n4 2 7 2 9\n7', '2'], ['First duplicate', '5\n4 2 7 2 9\n2', '1'], ['Missing', '3\n5 6 7\n2', '-1']]
    },
    {
      re: /missing number/i,
      input: 'First line N. Second line contains N-1 distinct integers from 1 through N with exactly one value missing.', output: 'Print the missing value.',
      tests: [['Middle', '5\n1 2 4 5', '3'], ['First', '4\n2 3 4', '1'], ['Last', '4\n1 2 3', '4']]
    },
    {
      re: /maximum consecutive ones|max.*consecutive.*1/i,
      input: 'First line n. Second line: a binary array of n values.', output: 'Print the longest run of consecutive 1 values.',
      tests: [['Mixed', '6\n1 1 0 1 1 1', '3'], ['No ones', '4\n0 0 0 0', '0'], ['All ones', '5\n1 1 1 1 1', '5']]
    },
    {
      re: /number that appears once|single number/i,
      input: 'First line n. Second line: n integers where exactly one value occurs once and every other value occurs twice.', output: 'Print the value that occurs once.',
      tests: [['Basic', '5\n4 1 2 1 2', '4'], ['Negative', '5\n-2 7 -2 5 5', '7'], ['Single', '1\n99', '99']]
    },
    {
      re: /two sum|2 sum/i,
      input: 'First line n. Second line: n integers. Third line: target. Exactly one valid pair exists.', output: 'Print the two zero-based indices separated by spaces. Either index order is accepted.',
      tests: [u('Basic', '4\n2 7 11 15\n9', '0 1'), u('Later pair', '5\n3 2 4 8 1\n6', '1 2'), u('Negative', '4\n-3 4 3 90\n0', '0 2')]
    },
    {
      re: /sort.*0.*1.*2|sort colors|dutch/i,
      input: 'First line n. Second line contains only 0, 1, and 2.', output: 'Print the sorted values separated by spaces.',
      tests: [t('Mixed', '6\n2 0 2 1 1 0', '0 0 1 1 2 2'), t('Already sorted', '5\n0 0 1 2 2', '0 0 1 2 2'), t('Single kind', '4\n2 2 2 2', '2 2 2 2')]
    },
    {
      re: /majority element/i,
      input: 'First line n. Second line: n integers. A value occurring more than floor(n/2) times is guaranteed.', output: 'Print the majority value.',
      tests: [['Basic', '7\n2 2 1 1 1 2 2', '2'], ['All same', '4\n5 5 5 5', '5'], ['Negative', '5\n-1 2 -1 -1 3', '-1']]
    },
    {
      re: /kadane|maximum subarray/i,
      input: 'First line n. Second line: n integers.', output: 'Print the maximum sum over all non-empty contiguous subarrays.',
      tests: [['Classic', '9\n-2 1 -3 4 -1 2 1 -5 4', '6'], ['All negative', '3\n-8 -2 -5', '-2'], ['All positive', '4\n1 2 3 4', '10'], ['Single', '1\n-7', '-7']]
    },
    {
      re: /best time.*stock|stock.*buy.*sell/i,
      input: 'First line n. Second line: daily prices. You may make at most one buy followed by one sell.', output: 'Print the maximum profit; print 0 if no profit is possible.',
      tests: [['Profit', '6\n7 1 5 3 6 4', '5'], ['Descending', '5\n7 6 4 3 1', '0'], ['Two days', '2\n1 9', '8']]
    },
    {
      re: /longest consecutive/i,
      input: 'First line n. Second line: n unsorted integers.', output: 'Print the length of the longest sequence of consecutive integer values.',
      tests: [['Classic', '6\n100 4 200 1 3 2', '4'], ['Duplicates', '9\n0 3 7 2 5 8 4 6 0', '9'], ['Single', '1\n10', '1']]
    },
    {
      re: /^binary search$|binary search.*find|search in sorted/i,
      input: 'First line n. Second line: n integers sorted ascending. Third line: target.', output: 'Print the zero-based index of target, or -1 when absent.',
      tests: [['Found', '6\n1 3 5 7 9 11\n7', '3'], ['Missing', '4\n2 4 6 8\n5', '-1'], ['Boundary', '5\n1 2 3 4 5\n1', '0']]
    },
    {
      re: /lower bound/i,
      input: 'First line n. Second line: sorted integers. Third line: target.', output: 'Print the first zero-based index i where a[i] >= target; print n if no such index exists.',
      tests: [['Inside', '5\n1 2 4 4 7\n4', '2'], ['Between', '5\n1 2 4 4 7\n3', '2'], ['Past end', '3\n1 2 3\n9', '3']]
    },
    {
      re: /upper bound/i,
      input: 'First line n. Second line: sorted integers. Third line: target.', output: 'Print the first zero-based index i where a[i] > target; print n if no such index exists.',
      tests: [['Duplicates', '5\n1 2 4 4 7\n4', '4'], ['Before all', '3\n2 3 4\n1', '0'], ['Past end', '3\n1 2 3\n3', '3']]
    },
    {
      re: /search insert position/i,
      input: 'First line n. Second line: sorted distinct integers. Third line: target.', output: 'Print the index where target exists or should be inserted to preserve sorted order.',
      tests: [['Found', '4\n1 3 5 6\n5', '2'], ['Middle insertion', '4\n1 3 5 6\n2', '1'], ['End', '4\n1 3 5 6\n7', '4']]
    },
    {
      re: /square root|sqrt/i,
      input: 'One non-negative integer n.', output: 'Print floor(sqrt(n)).',
      tests: [['Perfect square', '81', '9'], ['Floor', '27', '5'], ['Zero', '0', '0'], ['One', '1', '1']]
    },
    {
      re: /balanced parenth|valid parenth/i,
      input: 'One line containing only (), [], and {} bracket characters.', output: 'Print true when the bracket sequence is valid, otherwise false.',
      tests: [b('Valid mixed', '()[]{}', 'true'), b('Nested', '{[()]}', 'true'), b('Crossed', '([)]', 'false'), b('Unclosed', '(((', 'false')]
    },
    {
      re: /longest substring.*without repeating/i,
      input: 'One line containing a string.', output: 'Print the length of the longest substring with no repeated character.',
      tests: [['Classic', 'abcabcbb', '3'], ['Repeated', 'bbbbb', '1'], ['Mixed', 'pwwkew', '3'], ['Empty', '', '0']]
    },
    {
      re: /kth.*largest/i,
      input: 'First line n. Second line: n integers. Third line: k (1 means largest).', output: 'Print the kth largest value.',
      tests: [['Basic', '6\n3 2 1 5 6 4\n2', '5'], ['Duplicates', '9\n3 2 3 1 2 4 5 5 6\n4', '4'], ['First', '3\n8 1 7\n1', '8']]
    },
    {
      re: /climbing stairs/i,
      input: 'One integer n >= 0. You can climb 1 or 2 steps at a time.', output: 'Print the number of distinct ways to reach exactly step n. Treat n=0 as one empty way.',
      tests: [['Zero', '0', '1'], ['Two', '2', '2'], ['Five', '5', '8'], ['Ten', '10', '89']]
    },
    {
      re: /house robber/i,
      input: 'First line n. Second line: non-negative money values. Adjacent houses cannot both be robbed.', output: 'Print the maximum obtainable sum.',
      tests: [['Basic', '4\n1 2 3 1', '4'], ['Choice', '5\n2 7 9 3 1', '12'], ['Single', '1\n9', '9'], ['Empty', '0\n', '0']]
    },
    {
      re: /unique paths/i,
      input: 'Two positive integers m and n: grid rows and columns. Move only right or down.', output: 'Print the number of paths from top-left to bottom-right.',
      tests: [['3x7', '3 7', '28'], ['3x2', '3 2', '3'], ['Single cell', '1 1', '1']]
    },
    {
      re: /longest common subsequence|\blcs\b/i,
      input: 'Two lines, each containing one string.', output: 'Print the length of their longest common subsequence.',
      tests: [['Basic', 'abcde\nace', '3'], ['None', 'abc\ndef', '0'], ['Equal', 'algorithm\nalgorithm', '9']]
    },
    {
      re: /edit distance/i,
      input: 'Two lines containing source and target strings.', output: 'Print the minimum number of insertions, deletions, and replacements required.',
      tests: [['Horse', 'horse\nros', '3'], ['Intention', 'intention\nexecution', '5'], ['Equal', 'abc\nabc', '0'], ['Empty source', '\nabc', '3']]
    },
    {
      re: /longest increasing subsequence|\blis\b/i,
      input: 'First line n. Second line: n integers.', output: 'Print the length of the longest strictly increasing subsequence.',
      tests: [['Classic', '8\n10 9 2 5 3 7 101 18', '4'], ['Descending', '5\n5 4 3 2 1', '1'], ['Duplicates', '7\n0 1 0 3 2 3 4', '5']]
    },
    {
      re: /number of islands/i,
      input: 'First line: rows columns. Next rows lines contain 0/1 values without spaces. Connectivity is 4-directional.', output: 'Print the number of islands.',
      tests: [['One island', '4 5\n11110\n11010\n11000\n00000', '1'], ['Three islands', '4 5\n11000\n11000\n00100\n00011', '3'], ['Water', '2 3\n000\n000', '0']]
    },
    {
      re: /^selection sort$/i,
      input: 'First line n. Second line: n integers.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Reverse sorted', '5\n9 7 5 3 1', '1 3 5 7 9'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^bubble sort$/i,
      input: 'First line n. Second line: n integers.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Already sorted', '5\n1 2 3 4 5', '1 2 3 4 5'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^insertion sorting$/i,
      input: 'First line n. Second line: n integers.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Reverse sorted', '5\n9 7 5 3 1', '1 3 5 7 9'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^merge sorting$/i,
      input: 'First line n. Second line: n integers.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Reverse sorted', '5\n9 7 5 3 1', '1 3 5 7 9'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^recursive bubble sort$/i,
      input: 'First line n. Second line: n integers. Sort using a recursive bubble-sort formulation.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Already sorted', '5\n1 2 3 4 5', '1 2 3 4 5'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^recursive insertion sort$/i,
      input: 'First line n. Second line: n integers. Sort using a recursive insertion-sort formulation.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Reverse sorted', '5\n9 7 5 3 1', '1 3 5 7 9'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^quick sorting$/i,
      input: 'First line n. Second line: n integers.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Reverse sorted', '5\n9 7 5 3 1', '1 3 5 7 9'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /armstrong/i,
      input: 'One non-negative integer n.', output: 'Print true if n equals the sum of its own digits each raised to the power of the digit count, otherwise false.',
      tests: [b('153 is Armstrong', '153', 'true'), b('Not Armstrong', '123', 'false'), b('Single digit', '5', 'true'), b('9474 is Armstrong', '9474', 'true')]
    },
    {
      re: /print all divisors/i,
      input: 'One positive integer n.', output: 'Print every divisor of n in ascending order, separated by spaces.',
      tests: [t('36', '36', '1 2 3 4 6 9 12 18 36'), t('Prime', '13', '1 13'), t('One', '1', '1')]
    },
    {
      re: /print 1 to n/i,
      input: 'One non-negative integer n.', output: 'Print 1 through n in increasing order, separated by spaces.',
      tests: [t('Five', '5', '1 2 3 4 5'), t('One', '1', '1')]
    },
    {
      re: /print n to 1/i,
      input: 'One non-negative integer n.', output: 'Print n down to 1 in decreasing order, separated by spaces.',
      tests: [t('Five', '5', '5 4 3 2 1'), t('One', '1', '1')]
    },
    {
      re: /sum of first n numbers/i,
      input: 'One non-negative integer n.', output: 'Print the sum 1 + 2 + ... + n. Print 0 when n is 0.',
      tests: [['Ten', '10', '55'], ['One', '1', '1'], ['Zero', '0', '0']]
    },
    {
      re: /factorial of a given number/i,
      input: 'One non-negative integer n.', output: 'Print n factorial. Print 1 when n is 0.',
      tests: [['Five', '5', '120'], ['Zero', '0', '1'], ['One', '1', '1'], ['Seven', '7', '5040']]
    },
    {
      re: /reverse an array/i,
      input: 'First line n. Second line: n integers.', output: 'Print the array reversed, separated by spaces.',
      tests: [t('Basic', '5\n1 2 3 4 5', '5 4 3 2 1'), t('Single', '1\n9', '9'), t('Two', '2\n7 3', '3 7')]
    },
    {
      re: /check if string is palindrome/i,
      input: 'One line containing a string.', output: 'Print true if the string reads the same forward and backward, otherwise false.',
      tests: [b('Palindrome', 'madam', 'true'), b('Not palindrome', 'hello', 'false'), b('Single char', 'a', 'true')]
    },
    {
      re: /fibonacci/i,
      input: 'One non-negative integer n (0-indexed, fib(0)=0, fib(1)=1).', output: 'Print the nth Fibonacci number.',
      tests: [['Zero', '0', '0'], ['One', '1', '1'], ['Two', '2', '1'], ['Ten', '10', '55']]
    },
    {
      re: /counting frequencies of array elements|counting frequencies/i,
      input: 'First line n. Second line: n integers.', output: 'Print each distinct value that appears, ascending by value, as value:count pairs separated by spaces.',
      tests: [['Basic', '6\n1 2 2 3 3 3', '1:1 2:2 3:3'], ['All unique', '3\n5 6 7', '5:1 6:1 7:1'], ['Single', '1\n4', '4:1']]
    },
    {
      re: /highest occurring element/i,
      input: 'First line n. Second line: n integers.', output: 'Print the value with the highest frequency. If several values tie for the highest frequency, print whichever of them reaches that count first while scanning left to right.',
      tests: [['Basic', '6\n1 3 2 3 4 3', '3'], ['Tie, first wins', '4\n1 1 2 2', '1'], ['Single', '1\n9', '9']]
    },
    {
      re: /remove duplicates from sorted array/i,
      input: 'First line n. Second line: n integers in non-decreasing order.', output: 'Print k (the count of unique values) then the k unique values in order, all separated by spaces.',
      tests: [t('Basic', '5\n1 1 2 2 3', '3 1 2 3'), t('No duplicates', '3\n1 2 3', '3 1 2 3'), t('All same', '3\n5 5 5', '1 5')]
    },
    {
      re: /left rotate array by one/i,
      input: 'First line n. Second line: n integers.', output: 'Print the array after left-rotating it by one position, separated by spaces.',
      tests: [t('Basic', '5\n1 2 3 4 5', '2 3 4 5 1'), t('Two', '2\n1 2', '2 1'), t('Single', '1\n9', '9')]
    },
    {
      re: /left rotate array by k/i,
      input: 'First line n. Second line: n integers. Third line: k.', output: 'Print the array after left-rotating it by k positions, separated by spaces.',
      tests: [t('Basic', '7\n1 2 3 4 5 6 7\n2', '3 4 5 6 7 1 2'), t('K equals n', '3\n1 2 3\n3', '1 2 3'), t('K exceeds n', '3\n1 2 3\n4', '2 3 1')]
    },
    {
      re: /union of two sorted arrays/i,
      input: 'First line n1. Second line: n1 sorted integers. Third line n2. Fourth line: n2 sorted integers.', output: 'Print the sorted union (distinct values from both arrays) separated by spaces.',
      tests: [t('Basic', '5\n1 2 3 4 5\n5\n2 3 4 4 5', '1 2 3 4 5'), t('Disjoint', '2\n1 3\n2\n2 4', '1 2 3 4'), t('Duplicates within', '3\n1 1 2\n3\n2 2 3', '1 2 3')]
    },
    {
      re: /longest subarray with given sum k/i,
      input: 'First line n. Second line: n positive integers. Third line: k.', output: 'Print the length of the longest subarray whose elements sum to exactly k. Print 0 if none exists.',
      tests: [['Basic', '7\n1 2 3 1 1 1 1\n3', '3'], ['No match', '2\n1 2\n5', '0'], ['Single', '1\n3\n3', '1']]
    },
    {
      re: /^longest subarray with sum k$/i,
      input: 'First line n. Second line: n integers (may include negatives). Third line: k.', output: 'Print the length of the longest subarray whose elements sum to exactly k. Print 0 if none exists.',
      tests: [['With negatives', '3\n-1 1 1\n1', '3'], ['Zero sum', '3\n1 -1 0\n0', '3'], ['Basic', '5\n1 2 3 -2 5\n5', '2']]
    },
    {
      re: /rearrange array elements by sign/i,
      input: 'First line n (even). Second line: n integers with equal counts of positive and negative values.', output: 'Print the array with values alternating positive, negative, positive, negative..., preserving each side’s original relative order, starting with positive.',
      tests: [t('Basic', '6\n3 1 -2 -5 2 -4', '3 -2 1 -5 2 -4'), t('Already alternating', '4\n1 -1 2 -2', '1 -1 2 -2')]
    },
    {
      re: /next permutation/i,
      input: 'First line n. Second line: n integers.', output: 'Print the lexicographically next permutation, separated by spaces. If the array is the last permutation, print the lowest (sorted ascending) permutation.',
      tests: [t('Basic', '3\n1 2 3', '1 3 2'), t('Descending wraps', '3\n3 2 1', '1 2 3'), t('Middle', '3\n1 1 5', '1 5 1')]
    },
    {
      re: /leaders in an array/i,
      input: 'First line n. Second line: n integers.', output: 'Print every leader (an element strictly greater than every element to its right) in their original left-to-right order, separated by spaces. The last element is always a leader.',
      tests: [t('Basic', '6\n10 22 12 3 0 6', '22 12 6'), t('Increasing', '4\n1 2 3 4', '4'), t('Single', '1\n5', '5')]
    },
    {
      re: /set matrix zeroes/i,
      input: 'First line: rows cols. Next rows lines: cols space-separated integers.', output: 'Print the matrix after setting every row and column that originally contained a 0 entirely to 0, one row per line.',
      tests: [['Basic', '3 3\n1 1 1\n1 0 1\n1 1 1', '1 0 1\n0 0 0\n1 0 1', 'exact', false], ['No zero present', '3 3\n1 2 3\n4 5 6\n7 8 9', '1 2 3\n4 5 6\n7 8 9', 'exact'], ['Corner zero', '3 3\n1 1 0\n1 1 1\n1 1 1', '0 0 0\n1 1 0\n1 1 0', 'exact']]
    },
    {
      re: /rotate matrix by 90 degrees/i,
      input: 'First line: n (matrix is n by n). Next n lines: n space-separated integers.', output: 'Print the matrix rotated 90 degrees clockwise, one row per line.',
      tests: [['Basic', '3\n1 2 3\n4 5 6\n7 8 9', '7 4 1\n8 5 2\n9 6 3', 'exact', false], ['2x2', '2\n1 2\n3 4', '3 1\n4 2', 'exact']]
    },
    {
      re: /print the matrix in spiral manner|spiral matrix/i,
      input: 'First line: rows cols. Next rows lines: cols space-separated integers.', output: 'Print the elements visited in clockwise spiral order starting from the top-left, separated by spaces.',
      tests: [t('3x3', '3 3\n1 2 3\n4 5 6\n7 8 9', '1 2 3 6 9 8 7 4 5'), t('2x4', '2 4\n1 2 3 4\n5 6 7 8', '1 2 3 4 8 7 6 5')]
    },
    {
      re: /count subarrays with given sum/i,
      input: 'First line n. Second line: n non-negative integers. Third line: k.', output: 'Print the number of contiguous subarrays whose elements sum to exactly k.',
      tests: [['Basic', '3\n1 1 1\n2', '2'], ['All zero, k=0', '3\n0 0 0\n0', '6'], ['None', '3\n1 2 3\n100', '0']]
    },
    {
      re: /pascal.s triangle i\b/i,
      input: 'One integer n (0-indexed row number, row 0 is "1").', output: 'Print row n of Pascal’s triangle, separated by spaces.',
      tests: [t('Row 0', '0', '1'), t('Row 1', '1', '1 1'), t('Row 4', '4', '1 4 6 4 1')]
    },
    {
      re: /^3 sum$/i,
      input: 'First line n. Second line: n integers.', output: 'Print every unique triplet of values summing to zero. Sort the three values within each triplet ascending, then print one triplet per line sorted lexicographically by (first, second, third) value. Print nothing if no triplet exists.',
      tests: [['Classic', '6\n-1 0 1 2 -1 -4', '-1 -1 2\n-1 0 1', 'exact', false], ['No triplet', '3\n1 2 3', ''], ['All zero', '4\n0 0 0 0', '0 0 0']]
    },
    {
      re: /^4 sum$/i,
      input: 'First line n. Second line: n integers. Third line: target.', output: 'Print every unique quadruplet summing to target. Sort the four values within each quadruplet ascending, then print one quadruplet per line sorted lexicographically. Print nothing if none exists.',
      tests: [['Classic', '6\n1 0 -1 0 -2 2\n0', '-2 -1 1 2\n-2 0 0 2\n-1 0 0 1', 'exact', false], ['No quadruplet', '4\n1 2 3 4\n100', '']]
    },
    {
      re: /largest subarray with sum 0/i,
      input: 'First line n. Second line: n integers.', output: 'Print the length of the longest subarray summing to exactly 0. Print 0 if none exists.',
      tests: [['Basic', '8\n15 -2 2 -8 1 7 10 23', '5'], ['None', '3\n1 2 3', '0'], ['All zero', '3\n0 0 0', '3']]
    },
    {
      re: /count subarrays with given xor k/i,
      input: 'First line n. Second line: n integers. Third line: k.', output: 'Print the number of contiguous subarrays whose XOR equals k.',
      tests: [['Basic', '5\n4 2 2 6 4\n6', '4'], ['Basic 2', '5\n5 6 7 8 9\n5', '2'], ['None', '3\n1 2 3\n100', '0']]
    },
    {
      re: /merge overlapping subintervals|merge overlapping intervals/i,
      input: 'First line n. Next n lines: two integers, the start and end of each interval.', output: 'Print the merged non-overlapping intervals sorted by start, one "start end" pair per line.',
      tests: [['Basic', '4\n1 3\n2 6\n8 10\n15 18', '1 6\n8 10\n15 18', 'exact', false], ['No overlap', '2\n1 2\n3 4', '1 2\n3 4']]
    },
    {
      re: /merge two sorted arrays without extra space/i,
      input: 'First line n1. Second line: n1 sorted integers. Third line n2. Fourth line: n2 sorted integers.', output: 'Print all n1+n2 values fully sorted ascending (duplicates kept), separated by spaces.',
      tests: [t('Basic', '4\n1 3 5 7\n5\n0 2 6 8 9', '0 1 2 3 5 6 7 8 9'), t('Empty second', '3\n1 2 3\n0\n', '1 2 3')]
    },
    {
      re: /count inversions/i,
      input: 'First line n. Second line: n integers.', output: 'Print the number of pairs (i, j) with i < j and a[i] > a[j].',
      tests: [['Basic', '5\n2 4 1 3 5', '3'], ['Sorted', '3\n1 2 3', '0'], ['Reverse sorted', '5\n5 4 3 2 1', '10']]
    },
    {
      re: /reverse pairs/i,
      input: 'First line n. Second line: n integers.', output: 'Print the number of pairs (i, j) with i < j and a[i] > 2 * a[j].',
      tests: [['Basic', '5\n1 3 2 3 1', '2'], ['Classic', '5\n2 4 3 5 1', '3'], ['None', '3\n1 2 3', '0']]
    },
    {
      re: /maximum product subarray/i,
      input: 'First line n. Second line: n integers.', output: 'Print the maximum product over all non-empty contiguous subarrays.',
      tests: [['Basic', '4\n2 3 -2 4', '6'], ['Negatives around zero', '3\n-2 0 -1', '0'], ['Single', '1\n-3', '-3']]
    },
    {
      re: /search x in sorted array/i,
      input: 'First line n. Second line: n integers sorted ascending. Third line: x.', output: 'Print the zero-based index of x, or -1 when absent.',
      tests: [['Found', '6\n1 3 5 7 9 11\n7', '3'], ['Missing', '4\n2 4 6 8\n5', '-1']]
    },
    {
      re: /floor and ceil in sorted array/i,
      input: 'First line n. Second line: n integers sorted ascending. Third line: x.', output: 'Print the floor (largest value <= x) then the ceil (smallest value >= x), separated by a space. Print -1 for a side that does not exist.',
      tests: [t('Between', '6\n3 4 4 7 8 10\n5', '4 7'), t('Exact match', '7\n1 2 8 10 11 12 19\n8', '8 8'), t('Below all', '3\n5 6 7\n1', '-1 5')]
    },
    {
      re: /first and last occurrence/i,
      input: 'First line n. Second line: n integers sorted ascending. Third line: x.', output: 'Print the first and last zero-based index of x, separated by a space. Print -1 -1 if x is absent.',
      tests: [t('Basic', '6\n5 7 7 8 8 10\n8', '3 4'), t('Absent', '6\n5 7 7 8 8 10\n6', '-1 -1'), t('Single', '1\n3\n3', '0 0')]
    },
    {
      re: /count occurrences in a sorted array/i,
      input: 'First line n. Second line: n integers sorted ascending. Third line: x.', output: 'Print the number of times x occurs.',
      tests: [['Basic', '5\n1 2 2 2 3\n2', '3'], ['Zero', '3\n1 2 3\n9', '0']]
    },
    {
      re: /search in rotated sorted array-i$/i,
      input: 'First line n. Second line: n distinct integers, sorted ascending then rotated. Third line: x.', output: 'Print the zero-based index of x, or -1 when absent.',
      tests: [['Found', '7\n4 5 6 7 0 1 2\n0', '4'], ['Missing', '7\n4 5 6 7 0 1 2\n3', '-1'], ['No rotation', '2\n1 3\n3', '1']]
    },
    {
      re: /search in rotated sorted array-ii$/i,
      input: 'First line n. Second line: n integers (duplicates allowed), sorted ascending then rotated. Third line: x.', output: 'Print true if x is present, otherwise false.',
      tests: [b('Found with duplicates', '7\n2 5 6 0 0 1 2\n0', 'true'), b('Missing with duplicates', '7\n2 5 6 0 0 1 2\n3', 'false')]
    },
    {
      re: /find minimum in rotated sorted array/i,
      input: 'First line n. Second line: n distinct integers, sorted ascending then rotated.', output: 'Print the minimum value.',
      tests: [['Basic', '7\n4 5 6 7 0 1 2', '0'], ['No rotation', '4\n1 2 3 4', '1'], ['Single', '1\n1', '1']]
    },
    {
      re: /find out how many times the array is rotated/i,
      input: 'First line n. Second line: n distinct integers, sorted ascending then rotated.', output: 'Print the number of left rotations applied (equivalently, the index of the minimum value).',
      tests: [['Basic', '7\n4 5 6 7 0 1 2', '4'], ['No rotation', '4\n1 2 3 4', '0']]
    },
    {
      re: /single element in a sorted array/i,
      input: 'First line n (odd). Second line: n integers sorted ascending, where every value appears exactly twice except one.', output: 'Print the single non-duplicated value.',
      tests: [['Basic', '9\n1 1 2 3 3 4 4 8 8', '2'], ['At the end', '7\n3 3 7 7 10 11 11', '10']]
    },
    {
      re: /^find peak element$/i,
      input: 'First line n. Second line: n integers forming a single-peak (unimodal) sequence: strictly increasing then strictly decreasing.', output: 'Print the zero-based index of the peak element.',
      tests: [['Middle peak', '6\n1 3 5 7 4 2', '3'], ['Peak at start', '4\n9 7 5 3', '0'], ['Peak at end', '5\n1 2 3 4 9', '4']]
    },
    {
      re: /find nth root of a number/i,
      input: 'Two integers n and m on one line: the root degree and the number.', output: 'Print the integer x such that x^n = m, or -1 if no exact integer root exists.',
      tests: [['Exact', '2 9', '3'], ['Exact cube', '3 27', '3'], ['No exact root', '2 10', '-1']]
    },
    {
      re: /koko eating bananas/i,
      input: 'First line n. Second line: n pile sizes. Third line: h (hours available).', output: 'Print the minimum integer eating speed k so all piles are eaten within h hours.',
      tests: [['Basic', '4\n3 6 7 11\n8', '4'], ['Tight', '5\n30 11 23 4 20\n5', '30']]
    },
    {
      re: /minimum days to make m bouquets/i,
      input: 'First line n. Second line: n bloom days. Third line: m k (bouquets needed, flowers per bouquet, adjacent only).', output: 'Print the minimum number of days needed, or -1 if it is impossible.',
      tests: [['Basic', '5\n1 10 3 10 2\n3 1', '3'], ['Impossible', '5\n1 10 3 10 2\n4 2', '-1']]
    },
    {
      re: /find the smallest divisor/i,
      input: 'First line n. Second line: n positive integers. Third line: threshold.', output: 'Print the smallest divisor d such that the sum of ceil(a[i] / d) over all elements is at most threshold.',
      tests: [['Basic', '4\n1 2 5 9\n6', '5'], ['Tight', '5\n1 2 3 4 5\n11', '2']]
    },
    {
      re: /capacity to ship packages within d days/i,
      input: 'First line n. Second line: n package weights in shipping order. Third line: d (days).', output: 'Print the minimum ship capacity so all packages ship within d days without reordering.',
      tests: [['Basic', '10\n1 2 3 4 5 6 7 8 9 10\n5', '15'], ['Tight', '6\n3 2 2 4 1 4\n3', '6']]
    },
    {
      re: /kth missing positive number/i,
      input: 'First line n. Second line: n distinct positive integers sorted ascending. Third line: k.', output: 'Print the kth positive integer missing from the array.',
      tests: [['Basic', '5\n2 3 4 7 11\n5', '9'], ['Missing from start', '4\n1 5 11 19\n10', '13']]
    },
    {
      re: /aggressive cows/i,
      input: 'First line n. Second line: n stall positions. Third line: number of cows.', output: 'Print the largest possible minimum distance between any two placed cows.',
      tests: [['Basic', '5\n1 2 4 8 9\n3', '3'], ['Tight', '5\n1 2 3 4 5\n2', '4']]
    },
    {
      re: /book allocation problem/i,
      input: 'First line n. Second line: n page counts. Third line: m (students).', output: 'Print the minimum possible value of the maximum pages assigned to a student (contiguous allocation, every student gets at least one book). Print -1 if m exceeds n.',
      tests: [['Basic', '4\n12 34 67 90\n2', '113'], ['Impossible', '2\n10 20\n3', '-1']]
    },
    {
      re: /split array - largest sum/i,
      input: 'First line n. Second line: n integers. Third line: m (number of contiguous parts).', output: 'Print the minimum possible value of the largest subarray sum when the array is split into m contiguous parts.',
      tests: [['Basic', '5\n7 2 5 10 8\n2', '18'], ['Even split', '5\n1 2 3 4 5\n2', '9']]
    },
    {
      re: /painter.s partition/i,
      input: 'First line n. Second line: n board lengths. Third line: k (painters).', output: 'Print the minimum possible value of the maximum total length painted by one painter (contiguous boards per painter).',
      tests: [['Basic', '4\n10 20 30 40\n2', '60'], ['Equal boards', '4\n10 10 10 10\n2', '20']]
    },
    {
      re: /find row with maximum 1.s/i,
      input: 'First line: rows cols. Next rows lines: cols binary values (0/1), each row sorted ascending.', output: 'Print the zero-based index of the row with the most 1s. If no row has a 1, print -1. Ties print the first such row.',
      tests: [['Basic', '4 4\n0 1 1 1\n0 0 1 1\n1 1 1 1\n0 0 0 0', '2'], ['No ones', '2 2\n0 0\n0 0', '-1']]
    },
    {
      re: /search in a 2d matrix/i,
      input: 'First line: rows cols. Next rows lines: cols integers. Each row is sorted ascending and the first value of each row exceeds the last value of the previous row. Last line: target.', output: 'Print true if target is present, otherwise false.',
      tests: [b('Found', '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3', 'true'), b('Missing', '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13', 'false')]
    },
    {
      re: /search in 2d matrix.*ii/i,
      input: 'First line: rows cols. Next rows lines: cols integers, each row and column sorted ascending. Last line: target.', output: 'Print true if target is present, otherwise false.',
      tests: [b('Found', '5 5\n1 4 7 11 15\n2 5 8 12 19\n3 6 9 16 22\n10 13 14 17 24\n18 21 23 26 30\n5', 'true'), b('Missing', '5 5\n1 4 7 11 15\n2 5 8 12 19\n3 6 9 16 22\n10 13 14 17 24\n18 21 23 26 30\n20', 'false')]
    },
    {
      re: /find peak element.*ii/i,
      input: 'First line: rows cols. Next rows lines: cols integers forming a matrix with exactly one cell strictly greater than all of its (up to 4) orthogonal neighbors.', output: 'Print the peak cell as "row col" (zero-based).',
      tests: [['Basic', '3 3\n1 4 3\n6 9 5\n2 8 7', '1 1'], ['Corner peak', '2 2\n10 8\n5 2', '0 0']]
    },
    {
      re: /matrix median/i,
      input: 'First line: rows cols (rows * cols is odd). Next rows lines: cols integers, each row sorted ascending.', output: 'Print the median of all matrix elements.',
      tests: [['Basic', '3 3\n1 3 5\n2 6 9\n3 6 9', '5'], ['Basic 2', '3 3\n1 2 3\n4 5 6\n7 8 9', '5']]
    },
    {
      re: /kth element of 2 sorted arrays/i,
      input: 'First line n1. Second line: n1 sorted integers. Third line n2. Fourth line: n2 sorted integers. Fifth line: k (1-indexed).', output: 'Print the kth smallest element across both arrays combined.',
      tests: [['Basic', '5\n2 3 6 7 9\n4\n1 4 8 10\n5', '6'], ['From first array', '5\n100 112 256 349 770\n7\n72 86 113 119 265 445 892\n7', '256']]
    },
    {
      re: /remove outermost parentheses/i,
      input: 'One line containing a valid parentheses string made of one or more concatenated primitive groups.', output: 'Print the string with the outermost pair of each primitive group removed.',
      tests: [['Basic', '(()())(())', '()()()'], ['Empty groups', '()()', ''], ['Single group', '(())', '()']]
    },
    {
      re: /reverse words in a given string/i,
      input: 'One line containing a string of space-separated words (possibly with extra surrounding or repeated spaces).', output: 'Print the words in reverse order, separated by single spaces, with no leading/trailing spaces.',
      tests: [t('Basic', 'the sky is blue', 'blue is sky the'), t('Extra spaces', '  hello world  ', 'world hello')]
    },
    {
      re: /largest odd number in a string/i,
      input: 'One line containing a string of decimal digits.', output: 'Print the largest-value prefix of the string that ends in an odd digit. Print an empty line if no such prefix exists.',
      tests: [['Basic', '52', '5'], ['All even', '40', ''], ['Last digit odd', '123', '123']]
    },
    {
      re: /longest common prefix/i,
      input: 'First line n. Second line: n space-separated strings.', output: 'Print the longest common prefix shared by all strings. Print an empty line if there is none.',
      tests: [['Basic', '3\nflower flow flight', 'fl'], ['No common prefix', '2\ndog cat', ''], ['All identical', '2\ntest test', 'test']]
    },
    {
      re: /isomorphic string/i,
      input: 'Two lines, each containing one string of equal length.', output: 'Print true if the strings are isomorphic (a consistent one-to-one character mapping exists both ways), otherwise false.',
      tests: [b('Basic', 'egg\nadd', 'true'), b('Not isomorphic', 'foo\nbar', 'false'), b('Paper title', 'paper\ntitle', 'true')]
    },
    {
      re: /^rotate string$/i,
      input: 'Two lines, s then goal.', output: 'Print true if goal can be obtained by rotating s, otherwise false.',
      tests: [b('Basic', 'abcde\ncdeab', 'true'), b('Not a rotation', 'abcde\nabced', 'false')]
    },
    {
      re: /two strings are anagram/i,
      input: 'Two lines, each containing one string.', output: 'Print true if the strings are anagrams of each other, otherwise false.',
      tests: [b('Basic', 'anagram\nnagaram', 'true'), b('Not anagram', 'rat\ncar', 'false')]
    },
    {
      re: /sort characters by frequency/i,
      input: 'One line containing a string.', output: 'Print the characters sorted by descending frequency (each character repeated its own count of times). Break frequency ties by each character’s first appearance in the input.',
      tests: [['Basic', 'tree', 'eetr'], ['All same frequency', 'cccaaa', 'cccaaa']]
    },
    {
      re: /maximum nesting depth of the parentheses/i,
      input: 'One line containing a string that may include parentheses and other characters.', output: 'Print the maximum parentheses nesting depth.',
      tests: [['Basic', '(1+(2*3)+((8)/4))+1', '3'], ['Flat', '(1+2)*3', '1'], ['No parentheses', '123', '0']]
    },
    {
      re: /roman to integer/i,
      input: 'One line containing a valid Roman numeral.', output: 'Print its integer value.',
      tests: [['Basic', 'III', '3'], ['Subtractive', 'IX', '9'], ['Complex', 'MCMXCIV', '1994']]
    },
    {
      re: /string to integer|\batoi\b/i,
      input: 'One line containing a string to parse as a 32-bit signed integer, following the same rules as the C atoi function (skip leading spaces, optional sign, digits until a non-digit, clamp to the 32-bit signed range).', output: 'Print the parsed integer.',
      tests: [['Basic', '42', '42'], ['Signed with spaces', '   -42', '-42'], ['Trailing words', '4193 with words', '4193'], ['Overflow clamps', '91283472332', '2147483647']]
    },
    {
      re: /longest palindromic substring/i,
      input: 'One line containing a string.', output: 'Print any longest palindromic substring. Test inputs are chosen so the maximum-length palindromic substring is unique.',
      tests: [['Middle palindrome', 'xracecarx', 'xracecarx'], ['Classic', 'forgeeksskeegfor', 'geeksskeeg'], ['Single character', 'z', 'z']]
    },
    {
      re: /sum of beauty of all substrings/i,
      input: 'One line containing a string.', output: 'Print the sum, over every substring, of (its most frequent character count minus its least frequent character count).',
      tests: [['Basic', 'aabcb', '5'], ['All same character', 'aaaa', '0']]
    },
    {
      re: /reverse every word in a string/i,
      input: 'One line containing space-separated words.', output: 'Print the string with each word’s letters reversed, keeping word order and single-space separation.',
      tests: [['Basic', 'the sky is blue', 'eht yks si eulb'], ['Single word', 'hello', 'olleh']]
    },
    {
      re: /minimum number of bracket reversals/i,
      input: 'One line containing a string of only { and } characters.', output: 'Print the minimum number of bracket reversals needed to balance it, or -1 if the length is odd (impossible).',
      tests: [['Mismatched pairs', '}}{{', '2'], ['Odd length', '}{{', '-1'], ['Already balanced', '{}{}', '0']]
    },
    {
      re: /count and say/i,
      input: 'One integer n (1-indexed term of the count-and-say sequence).', output: 'Print the nth term of the count-and-say sequence (term 1 is "1"; each later term describes the run-lengths of the previous term).',
      tests: [['n=1', '1', '1'], ['n=4', '4', '1211'], ['n=5', '5', '111221']]
    },
    {
      re: /rabin karp/i,
      input: 'First line: the text. Second line: the pattern.', output: 'Print every zero-based starting index where the pattern occurs in the text, in increasing order, separated by spaces. Print an empty line if it never occurs.',
      tests: [t('Basic', 'abxabcabcaby\nabc', '3 6'), t('No match', 'aaaa\nbb', '')]
    },
    {
      re: /^z function$/i,
      input: 'One line containing a string.', output: 'Print the Z-array: for each index i, the length of the longest substring starting at i that matches a prefix of the string. Z[0] equals the string length.',
      tests: [t('Basic', 'aabxaabxcaabxaabxay', '19 1 0 0 4 1 0 0 0 8 1 0 0 5 1 0 0 1 0'), t('All same char', 'aaaa', '4 3 2 1')]
    },
    {
      re: /kmp algorithm|lps array/i,
      input: 'One line containing a string.', output: 'Print the LPS (longest proper prefix that is also a suffix) array used by the KMP algorithm, one value per index, separated by spaces.',
      tests: [t('Basic', 'abababca', '0 0 1 2 3 4 0 1'), t('All same char', 'aaaa', '0 1 2 3')]
    },
    {
      re: /shortest palindrome/i,
      input: 'One line containing a string.', output: 'Print the shortest palindrome obtainable by adding characters only in front of the string.',
      tests: [['Basic', 'aacecaaa', 'aaacecaaa'], ['No palindromic prefix', 'abcd', 'dcbabcd'], ['Single character', 'a', 'a']]
    },
    {
      re: /longest happy prefix/i,
      input: 'One line containing a string.', output: 'Print the longest proper prefix of the string that is also a suffix. Print an empty line if none exists (other than the empty string).',
      tests: [['Basic', 'level', 'l'], ['Repeating', 'ababab', 'abab'], ['None', 'asdf', '']]
    },
    {
      re: /i-th bit is set|ith bit is set/i,
      input: 'Two integers n and i on one line (i is the zero-based bit position).', output: 'Print true if bit i of n is set, otherwise false.',
      tests: [b('Set', '5 0', 'true'), b('Not set', '5 1', 'false'), b('High bit', '8 3', 'true')]
    },
    {
      re: /number is odd or not/i,
      input: 'One integer n.', output: 'Print true if n is odd, otherwise false.',
      tests: [b('Odd', '7', 'true'), b('Even', '8', 'false')]
    },
    {
      re: /power of 2 or not|power of two/i,
      input: 'One positive integer n.', output: 'Print true if n is a power of two, otherwise false.',
      tests: [b('Power of two', '16', 'true'), b('Not a power', '18', 'false'), b('One', '1', 'true')]
    },
    {
      re: /number of set bits/i,
      input: 'One non-negative integer n.', output: 'Print the number of set (1) bits in n’s binary representation.',
      tests: [['Basic', '7', '3'], ['Power of two', '8', '1'], ['Zero', '0', '0']]
    },
    {
      re: /rightmost unset bit/i,
      input: 'One non-negative integer n.', output: 'Print n after setting its rightmost unset (0) bit to 1.',
      tests: [['Basic', '6', '7'], ['All ones', '7', '15'], ['Zero', '0', '1']]
    },
    {
      re: /swap two numbers/i,
      input: 'Two integers a and b on one line.', output: 'Print b then a, separated by a space.',
      tests: [t('Basic', '3 7', '7 3'), t('Negatives', '-2 5', '5 -2')]
    },
    {
      re: /divide two numbers without/i,
      input: 'Two integers: dividend and divisor, on one line.', output: 'Print the quotient truncated toward zero, without using multiplication or division operators.',
      tests: [['Basic', '10 3', '3'], ['Exact', '20 4', '5'], ['Negative', '-7 2', '-3']]
    },
    {
      re: /minimum bit flips/i,
      input: 'Two non-negative integers start and goal on one line.', output: 'Print the minimum number of bit flips to convert start into goal.',
      tests: [['Basic', '10 7', '3'], ['Already equal', '3 3', '0']]
    },
    {
      re: /power set/i,
      input: 'One line containing a string of distinct characters.', output: 'Print every subset (as its characters, in original relative order; the empty subset printed as "-"), one per output token, in increasing bitmask order, separated by spaces.',
      tests: [t('Two chars', 'ab', '- a b ab'), t('Three chars', 'abc', '- a b ab c ac bc abc')]
    },
    {
      re: /xor of numbers in a given range/i,
      input: 'Two integers l and r on one line.', output: 'Print the XOR of every integer from l to r inclusive.',
      tests: [['Basic', '2 5', '0'], ['Single value', '4 4', '4']]
    },
    {
      re: /print prime factors/i,
      input: 'One integer n >= 2.', output: 'Print the prime factors of n in ascending order, with repetition for each power, separated by spaces.',
      tests: [t('Basic', '12', '2 2 3'), t('Prime', '13', '13'), t('Power of two', '16', '2 2 2 2')]
    },
    {
      re: /^divisors of a number$/i,
      input: 'One positive integer n.', output: 'Print every divisor of n in ascending order, separated by spaces.',
      tests: [t('36', '36', '1 2 3 4 6 9 12 18 36'), t('Prime', '13', '1 13')]
    },
    {
      re: /count primes in range/i,
      input: 'Two integers l and r on one line.', output: 'Print the number of primes in the inclusive range [l, r].',
      tests: [['Basic', '10 20', '4'], ['Single below 2', '1 1', '0']]
    },
    {
      re: /prime factorisation/i,
      input: 'One integer n >= 2.', output: 'Print the prime factorization as "p^e" terms in ascending prime order, separated by spaces.',
      tests: [t('Basic', '12', '2^2 3^1'), t('Prime', '13', '13^1'), t('Composite', '360', '2^3 3^2 5^1')]
    },
    {
      re: /^pow\(x, ?n\)$/i,
      input: 'Two integers x and n on one line. For this judge, x is an integer and n is non-negative (the exact contract validates general negative-exponent/fractional cases with your own tests).', output: 'Print x raised to the power n.',
      tests: [['Basic', '2 10', '1024'], ['Exponent zero', '5 0', '1'], ['Exponent one', '7 1', '7']]
    },
    {
      re: /count good numbers/i,
      input: 'One integer n (string length). Even indices (0-indexed) must hold an even digit, odd indices must hold a prime digit (2,3,5,7).', output: 'Print the count of valid strings modulo 1000000007.',
      tests: [['n=1', '1', '5'], ['n=4', '4', '400'], ['n=50', '50', '564908303']]
    },
    {
      re: /sort a stack using recursion|sort a stack\b/i,
      input: 'First line n. Second line: n integers representing the stack contents.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [t('Basic', '5\n3 1 4 1 5', '1 1 3 4 5'), t('Already sorted', '3\n1 2 3', '1 2 3')]
    },
    {
      re: /^reverse a stack$/i,
      input: 'First line n. Second line: n integers representing the stack contents.', output: 'Print the values in reverse order, separated by spaces.',
      tests: [t('Basic', '5\n1 2 3 4 5', '5 4 3 2 1'), t('Two', '2\n1 2', '2 1')]
    },
    {
      re: /generate binary strings without consecutive 1.s/i,
      input: 'One integer n (string length).', output: 'Print every binary string of length n with no two consecutive 1s, sorted ascending, separated by spaces.',
      tests: [t('n=2', '2', '00 01 10'), t('n=3', '3', '000 001 010 100 101')]
    },
    {
      re: /generate parentheses/i,
      input: 'One integer n (number of pairs).', output: 'Print every well-formed parentheses string of n pairs, sorted ascending, separated by spaces.',
      tests: [t('n=2', '2', '(()) ()()'), t('n=3', '3', '((())) (()()) (())() ()(()) ()()()')]
    },
    {
      re: /count all subsequences with sum k/i,
      input: 'First line n. Second line: n non-negative integers. Third line: k.', output: 'Print the number of subsequences (subsets by value selection) whose elements sum to exactly k.',
      tests: [['Basic', '3\n1 2 3\n3', '2'], ['With zeros', '3\n0 0 1\n1', '4']]
    },
    {
      re: /exists a subsequence with sum k|check if there exists a subsequence/i,
      input: 'First line n. Second line: n non-negative integers. Third line: k.', output: 'Print true if some subsequence sums to exactly k, otherwise false.',
      tests: [b('Found', '3\n1 2 3\n5', 'true'), b('Not found', '3\n1 2 3\n100', 'false')]
    },
    {
      re: /^combination sum$/i,
      input: 'First line n. Second line: n distinct candidate values (each reusable unlimited times). Third line: target.', output: 'Print every unique combination summing to target: sort each combination ascending, then print one per line sorted lexicographically by the combination’s values. Print nothing if none exist.',
      tests: [['Basic', '4\n2 3 6 7\n7', '2 2 3\n7', 'exact', false], ['Basic 2', '3\n2 3 5\n8', '2 2 2 2\n2 3 3\n3 5']]
    },
    {
      re: /combination sum ii\b/i,
      input: 'First line n. Second line: n candidate values (may repeat, each usable at most once). Third line: target.', output: 'Print every unique combination summing to target: sort each combination ascending, then print one per line sorted lexicographically. Print nothing if none exist.',
      tests: [['Basic', '7\n10 1 2 7 6 1 5\n8', '1 1 6\n1 2 5\n1 7\n2 6', 'exact', false], ['Repeated candidate', '5\n2 5 2 1 2\n5', '1 2 2\n5', 'exact']]
    },
    {
      re: /^subsets i$/i,
      input: 'First line n. Second line: n distinct integers.', output: 'Print every subset: sort each subset ascending, then print one per line ordered first by subset size then lexicographically. Print "-" for the empty subset.',
      tests: [['Basic', '3\n1 2 3', '-\n1\n2\n3\n1 2\n1 3\n2 3\n1 2 3', 'exact', false], ['Two elements', '2\n1 2', '-\n1\n2\n1 2', 'exact']]
    },
    {
      re: /^subsets ii$/i,
      input: 'First line n. Second line: n integers (duplicates allowed).', output: 'Print every unique subset (as a set of values, duplicates in the array can still repeat within one subset): sort each subset ascending, then print one per line ordered first by subset size then lexicographically. Print "-" for the empty subset.',
      tests: [['With duplicates', '3\n1 2 2', '-\n1\n2\n1 2\n2 2\n1 2 2', 'exact', false], ['Single element', '1\n1', '-\n1', 'exact']]
    },
    {
      re: /combination sum iii/i,
      input: 'Two integers k and n on one line: choose k distinct numbers from 1-9 summing to n.', output: 'Print every valid combination: sort each ascending, then print one per line sorted lexicographically. Print nothing if none exist.',
      tests: [['k=3 n=7', '3 7', '1 2 4'], ['k=3 n=9', '3 9', '1 2 6\n1 3 5\n2 3 4']]
    },
    {
      re: /letter combinations of a phone number/i,
      input: 'One line containing digits 2-9 (standard phone keypad letters; empty input produces no combinations).', output: 'Print every letter combination, sorted ascending, separated by spaces.',
      tests: [t('Two digits', '23', 'ad ae af bd be bf cd ce cf'), t('One digit', '2', 'a b c')]
    },
    {
      re: /^palindrome partitioning$/i,
      input: 'One line containing a string.', output: 'Print every way to partition the string into palindromic substrings: one partition per line, its parts space-separated in original left-to-right order. Order the partitions by comparing them part-by-part as strings (shorter first part sorts first); print nothing if the string is empty.',
      tests: [['s=aab', 'aab', 'a a b\naa b', 'exact', false], ['s=aaa', 'aaa', 'a a a\na aa\naa a\naaa']]
    },
    {
      re: /^word break$/i,
      input: 'First line: the string s. Second line: n. Third line: n space-separated dictionary words.', output: 'Print true if s can be segmented into a space-separated sequence of dictionary words, otherwise false.',
      tests: [b('Basic', 'leetcode\n2\nleet code', 'true'), b('Not breakable', 'catsandog\n5\ncats dog sand and cat', 'false')]
    },
    {
      re: /n queen/i,
      input: 'One integer n (board size).', output: 'Print the number of distinct solutions to the n-queens problem.',
      tests: [['n=4', '4', '2'], ['n=1', '1', '1'], ['n=8', '8', '92']]
    },
    {
      re: /word search/i,
      input: 'First line: rows cols. Next rows lines: cols characters with no separator (one row per line). Last line: the target word.', output: 'Print true if the word can be traced through orthogonally-adjacent, non-reused cells, otherwise false.',
      tests: [b('Found', '3 4\nABCE\nSFCS\nADEE\nABCCED', 'true'), b('Not found', '3 4\nABCE\nSFCS\nADEE\nABCB', 'false')]
    },
    {
      re: /max consecutive ones iii/i,
      input: 'First line n. Second line: a binary array. Third line: k (allowed 0-to-1 flips).', output: 'Print the longest run of 1s obtainable by flipping at most k zeros.',
      tests: [['Basic', '11\n1 1 1 0 0 0 1 1 1 1 0\n2', '6'], ['All ones', '3\n1 1 1\n1', '3']]
    },
    {
      re: /fruit into baskets/i,
      input: 'First line n. Second line: n integers (fruit types).', output: 'Print the length of the longest subarray containing at most 2 distinct values.',
      tests: [['Basic', '3\n1 2 1', '3'], ['Three types', '4\n0 1 2 2', '3'], ['Long run', '5\n1 2 3 2 2', '4']]
    },
    {
      re: /longest repeating character replacement/i,
      input: 'First line: the string s. Second line: k (allowed replacements).', output: 'Print the length of the longest substring obtainable by replacing at most k characters so all characters match.',
      tests: [['Basic', 'ABAB\n2', '4'], ['Basic 2', 'AABABBA\n1', '4']]
    },
    {
      re: /binary subarrays with sum/i,
      input: 'First line n. Second line: a binary array. Third line: goal.', output: 'Print the number of subarrays summing to exactly goal.',
      tests: [['Basic', '5\n1 0 1 0 1\n2', '4'], ['All zero, goal 0', '5\n0 0 0 0 0\n0', '15']]
    },
    {
      re: /nice subarrays/i,
      input: 'First line n. Second line: n integers. Third line: k (number of odd values required).', output: 'Print the number of subarrays containing exactly k odd numbers.',
      tests: [['Basic', '5\n1 1 2 1 1\n3', '2'], ['No odd values', '3\n2 4 6\n1', '0']]
    },
    {
      re: /substrings containing all three characters/i,
      input: 'One line containing a string of only characters a, b, and c.', output: 'Print the number of substrings that contain at least one a, one b, and one c.',
      tests: [['Basic', 'abcabc', '10'], ['Basic 2', 'aaacb', '3']]
    },
    {
      re: /maximum points you can obtain from cards/i,
      input: 'First line n. Second line: n card values. Third line: k (cards to take from either end).', output: 'Print the maximum obtainable sum by taking exactly k cards from the front and/or back.',
      tests: [['Basic', '7\n1 2 3 4 5 6 1\n3', '12'], ['Take all cards', '3\n2 2 2\n3', '6']]
    },
    {
      re: /at most k distinct characters/i,
      input: 'First line: the string s. Second line: k.', output: 'Print the length of the longest substring containing at most k distinct characters.',
      tests: [['Basic', 'araaci\n2', '4'], ['Basic 2', 'cbbebi\n3', '5']]
    },
    {
      re: /subarrays with k different integers/i,
      input: 'First line n. Second line: n integers. Third line: k.', output: 'Print the number of subarrays containing exactly k distinct integers.',
      tests: [['Basic', '5\n1 2 1 2 3\n2', '7'], ['Basic 2', '5\n1 2 1 3 4\n3', '3']]
    },
    {
      re: /minimum window substring/i,
      input: 'First line: string s. Second line: string t.', output: 'Print the shortest substring of s containing every character of t (with at least its multiplicity in t). Print an empty line if none exists. Test inputs have a unique shortest window.',
      tests: [['Basic', 'ADOBECODEBANC\nABC', 'BANC'], ['No window', 'a\nb', '']]
    },
    {
      re: /minimum window subsequence/i,
      input: 'First line: string s. Second line: string t.', output: 'Print the shortest (leftmost among ties) substring of s in which t appears as a subsequence. Print an empty line if none exists.',
      tests: [['Basic', 'abcdebdde\nbde', 'bcde'], ['No match', 'abc\nxyz', '']]
    },
    {
      re: /balanced paranthesis/i,
      input: 'One line containing only (), [], and {} bracket characters.', output: 'Print true when the bracket sequence is valid, otherwise false.',
      tests: [b('Valid mixed', '()[]{}', 'true'), b('Nested', '{[()]}', 'true'), b('Crossed', '([)]', 'false'), b('Unclosed', '(((', 'false')]
    },
    {
      re: /infix to postfix/i,
      input: 'One line containing a fully-parenthesized-or-not infix expression using single lowercase letter operands and + - * / ^ (no spaces).', output: 'Print the equivalent postfix expression.',
      tests: [['Basic', 'a+b*c', 'abc*+'], ['Explicit parens', '(a+b)*c', 'ab+c*'], ['Mixed', 'a+b*c-d/e', 'abc*+de/-']]
    },
    {
      re: /infix to prefix/i,
      input: 'One line containing an infix expression using single lowercase letter operands and + - * / ^ (no spaces).', output: 'Print the equivalent prefix expression.',
      tests: [['Basic', 'a+b*c', '+a*bc'], ['Explicit parens', '(a+b)*c', '*+abc']]
    },
    {
      re: /postfix to infix/i,
      input: 'One line containing a postfix expression using single lowercase letter operands and + - * / ^.', output: 'Print the equivalent fully-parenthesized infix expression.',
      tests: [['Basic', 'abc*+', '(a+(b*c))'], ['Basic 2', 'ab+c*', '((a+b)*c)']]
    },
    {
      re: /prefix to infix/i,
      input: 'One line containing a prefix expression using single lowercase letter operands and + - * / ^.', output: 'Print the equivalent fully-parenthesized infix expression.',
      tests: [['Basic', '+a*bc', '(a+(b*c))'], ['Basic 2', '*+abc', '((a+b)*c)']]
    },
    {
      re: /prefix to postfix/i,
      input: 'One line containing a prefix expression using single lowercase letter operands and + - * / ^.', output: 'Print the equivalent postfix expression.',
      tests: [['Basic', '+a*bc', 'abc*+'], ['Basic 2', '*+abc', 'ab+c*']]
    },
    {
      re: /postfix to prefix/i,
      input: 'One line containing a postfix expression using single lowercase letter operands and + - * / ^.', output: 'Print the equivalent prefix expression.',
      tests: [['Basic', 'abc*+', '+a*bc'], ['Basic 2', 'ab+c*', '*+abc']]
    },
    {
      re: /^next greater element$/i,
      input: 'First line n. Second line: n integers.', output: 'Print, for each element, the next element to its right that is strictly greater, or -1 if none exists.',
      tests: [t('Basic', '4\n1 3 2 4', '3 4 4 -1'), t('Descending', '4\n4 3 2 1', '-1 -1 -1 -1')]
    },
    {
      re: /next greater element.*2/i,
      input: 'First line n. Second line: n integers, treated as circular.', output: 'Print, for each element, the next strictly greater element considering the array as circular, or -1 if none exists.',
      tests: [t('Basic', '3\n1 2 1', '2 -1 2'), t('Descending', '5\n5 4 3 2 1', '-1 5 5 5 5')]
    },
    {
      re: /next smaller element/i,
      input: 'First line n. Second line: n integers.', output: 'Print, for each element, the next element to its right that is strictly smaller, or -1 if none exists.',
      tests: [t('Basic', '5\n4 8 5 2 25', '2 5 2 -1 -1'), t('Ascending', '4\n1 2 3 4', '-1 -1 -1 -1')]
    },
    {
      re: /number of greater elements to the right/i,
      input: 'First line n. Second line: n integers.', output: 'Print, for each element, the count of elements to its right that are strictly greater.',
      tests: [t('Basic', '5\n3 4 2 7 5', '3 2 2 0 0'), t('Descending', '3\n5 4 3', '0 0 0')]
    },
    {
      re: /trapping rainwater/i,
      input: 'First line n. Second line: n non-negative bar heights.', output: 'Print the total units of water trapped.',
      tests: [['Classic', '12\n0 1 0 2 1 0 1 3 2 1 2 1', '6'], ['No water', '3\n1 2 3', '0']]
    },
    {
      re: /sum of subarray minimums/i,
      input: 'First line n. Second line: n positive integers.', output: 'Print the sum, over every contiguous subarray, of its minimum value, modulo 1000000007.',
      tests: [['Basic', '4\n3 1 2 4', '17'], ['Basic 2', '5\n11 81 94 43 3', '444']]
    },
    {
      re: /asteroid collision/i,
      input: 'First line n. Second line: n integers (positive moves right, negative moves left; magnitude is size).', output: 'Print the surviving asteroids after all collisions resolve, left to right, separated by spaces. Print an empty line if none survive.',
      tests: [t('Basic', '3\n5 10 -5', '5 10'), t('Mutual destruction', '2\n8 -8', ''), t('Same direction', '3\n10 2 -5', '10')]
    },
    {
      re: /sum of subarray ranges/i,
      input: 'First line n. Second line: n integers.', output: 'Print the sum, over every contiguous subarray, of (its maximum minus its minimum).',
      tests: [['Basic', '3\n1 2 3', '4'], ['With duplicates', '3\n1 3 3', '4']]
    },
    {
      re: /remove k digits/i,
      input: 'First line: a non-negative integer as a digit string. Second line: k (digits to remove).', output: 'Print the smallest possible number (no leading zeroes, "0" if empty) after removing exactly k digits while keeping the remaining digits in order.',
      tests: [['Basic', '1432219\n3', '1219'], ['Leading zero result', '10200\n1', '200'], ['Removes everything meaningful', '10\n2', '0']]
    },
    {
      re: /largest rectangle in a histogram/i,
      input: 'First line n. Second line: n non-negative bar heights.', output: 'Print the area of the largest rectangle that fits within the histogram.',
      tests: [['Basic', '6\n2 1 5 6 2 3', '10'], ['Increasing', '5\n1 2 3 4 5', '9']]
    },
    {
      re: /maximum rectangles/i,
      input: 'First line: rows cols. Next rows lines: cols binary values (0/1).', output: 'Print the area of the largest rectangle containing only 1s.',
      tests: [['Basic', '4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0', '6'], ['Small', '2 2\n0 1\n1 1', '2']]
    },
    {
      re: /sliding window maximum/i,
      input: 'First line n. Second line: n integers. Third line: k (window size).', output: 'Print the maximum of every size-k contiguous window, separated by spaces.',
      tests: [t('Basic', '8\n1 3 -1 -3 5 3 6 7\n3', '3 3 5 5 6 7'), t('K equals n', '3\n1 2 3\n3', '3')]
    },
    {
      re: /stock span problem/i,
      input: 'First line n. Second line: n daily stock prices in order.', output: 'Print the span of each day (consecutive days up to and including today with price <= today’s price), separated by spaces.',
      tests: [t('Basic', '7\n100 80 60 70 60 75 85', '1 1 1 2 1 4 6'), t('Increasing', '4\n10 20 30 40', '1 2 3 4')]
    },
    {
      re: /celebrity problem/i,
      input: 'First line n. Next n lines: n binary values, where row i, column j is 1 if person i knows person j.', output: 'Print the zero-based index of the celebrity (known by everyone, knows no one), or -1 if none exists.',
      tests: [['Celebrity exists', '3\n0 1 0\n0 0 0\n0 1 0', '1'], ['No celebrity', '2\n0 1\n1 0', '-1']]
    },
    {
      re: /kth smallest element in an array/i,
      input: 'First line n. Second line: n integers. Third line: k (1 means smallest).', output: 'Print the kth smallest value.',
      tests: [['Basic', '6\n7 10 4 3 20 15\n3', '7'], ['Basic 2', '6\n7 10 4 3 20 15\n4', '10']]
    },
    {
      re: /sort k sorted array/i,
      input: 'First line n. Second line: n integers, each at most k positions from its sorted position.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [t('Basic', '7\n6 5 3 2 8 10 9', '2 3 5 6 8 9 10'), t('Already sorted', '3\n1 2 3', '1 2 3')]
    },
    {
      re: /merge k sorted lists/i,
      input: 'First line: number of lists m. For each list: a line with its length, then a line with that many sorted integers.', output: 'Print every value from all lists fully merged in sorted ascending order, separated by spaces.',
      tests: [t('Basic', '3\n3\n1 4 5\n3\n1 3 4\n2\n2 6', '1 1 2 3 4 4 5 6'), t('Basic 2', '3\n2\n1 2\n1\n3\n3\n4 5 6', '1 2 3 4 5 6')]
    },
    {
      re: /replace elements by their rank/i,
      input: 'First line n. Second line: n integers.', output: 'Print each element replaced by its dense rank (1 = smallest distinct value), separated by spaces.',
      tests: [t('Basic', '6\n20 15 26 2 98 6', '4 3 5 1 6 2'), t('With duplicates', '3\n2 2 1', '2 2 1')]
    },
    {
      re: /array represents a min heap/i,
      input: 'First line n. Second line: n integers representing a binary tree in level order (index i’s children are at 2i+1 and 2i+2).', output: 'Print true if it satisfies the min-heap property, otherwise false.',
      tests: [b('Valid heap', '6\n1 3 6 5 9 8', 'true'), b('Invalid heap', '6\n9 3 6 5 1 8', 'false')]
    },
    {
      re: /convert min heap to max heap/i,
      input: 'First line n. Second line: n integers forming a valid min-heap in level order.', output: 'Print the array after converting it to a valid max-heap (level order), separated by spaces.',
      tests: [t('Basic', '10\n3 5 9 6 8 20 10 12 18 9', '20 18 10 12 9 9 3 5 6 8'), t('Small', '3\n1 2 3', '3 2 1')]
    },
    {
      re: /task scheduler/i,
      input: 'First line: the task string (each character is a task type). Second line: n (required cooldown between identical tasks).', output: 'Print the minimum total time units (including idle slots) to complete all tasks.',
      tests: [['Cooldown required', 'AAABBB\n2', '8'], ['No idle needed', 'AAABBB\n0', '6']]
    },
    {
      re: /hand of straights/i,
      input: 'First line n. Second line: n card values. Third line: groupSize.', output: 'Print true if the hand can be split into groups of groupSize consecutive values, otherwise false.',
      tests: [b('Basic', '9\n1 2 3 6 2 3 4 7 8\n3', 'true'), b('Impossible', '5\n1 2 3 4 5\n4', 'false')]
    },
    {
      re: /minimum cost to connect sticks/i,
      input: 'First line n. Second line: n stick lengths.', output: 'Print the minimum total cost to connect all sticks into one, where combining two sticks costs the sum of their lengths.',
      tests: [['Basic', '3\n2 4 3', '14'], ['Four sticks', '4\n1 8 3 5', '30']]
    },
    {
      re: /maximum sum combination/i,
      input: 'First line n1. Second line: n1 integers. Third line n2. Fourth line: n2 integers. Fifth line: k.', output: 'Print the k largest possible sums formed by picking one value from each array, sorted descending, separated by spaces.',
      tests: [t('Basic', '2\n3 2\n2\n1 4\n2', '7 6'), t('Basic 2', '3\n1 5 3\n3\n2 4 6\n3', '11 9 9')]
    },
    {
      re: /top k frequent elements/i,
      input: 'First line n. Second line: n integers. Third line: k.', output: 'Print the k most frequent values, most frequent first. Break frequency ties by smaller value first.',
      tests: [t('Basic', '6\n1 1 1 2 2 3\n2', '1 2'), t('Tie broken by value', '5\n4 4 5 5 6\n2', '4 5')]
    },
    {
      re: /assign cookies/i,
      input: 'First line n. Second line: n children’s greed factors. Third line m. Fourth line: m cookie sizes.', output: 'Print the maximum number of children that can be made content.',
      tests: [['Basic', '3\n1 2 3\n2\n1 1', '1'], ['Basic 2', '2\n1 2\n3\n1 2 3', '2']]
    },
    {
      re: /lemonade change/i,
      input: 'First line n. Second line: n customer bill values (5, 10, or 20), each customer pays with one bill for a $5 item.', output: 'Print true if every customer can be given correct change, otherwise false.',
      tests: [b('Basic', '5\n5 5 5 10 20', 'true'), b('Fails', '5\n5 5 10 10 20', 'false')]
    },
    {
      re: /valid paranthesis checker/i,
      input: 'One line containing only (), [], and {} bracket characters.', output: 'Print true when the bracket sequence is valid, otherwise false.',
      tests: [b('Valid mixed', '()[]{}', 'true'), b('Nested', '{[()]}', 'true'), b('Crossed', '([)]', 'false')]
    },
    {
      re: /n meetings in one room/i,
      input: 'First line n. Second line: n start times. Third line: n end times.', output: 'Print the maximum number of non-overlapping meetings (a meeting ending at time t frees the room at t, so another can start at t).',
      tests: [['Basic', '6\n1 3 0 5 8 5\n2 4 6 7 9 9', '4'], ['All fit', '3\n1 4 7\n2 5 8', '3']]
    },
    {
      re: /jump game - i$/i,
      input: 'First line n. Second line: n non-negative integers, the max jump length from each index.', output: 'Print true if you can reach the last index starting from index 0, otherwise false.',
      tests: [b('Can reach', '5\n2 3 1 1 4', 'true'), b('Cannot reach', '5\n3 2 1 0 4', 'false')]
    },
    {
      re: /jump game ii/i,
      input: 'First line n. Second line: n non-negative integers, the max jump length from each index. It is guaranteed the last index is reachable.', output: 'Print the minimum number of jumps to reach the last index.',
      tests: [['Basic', '5\n2 3 1 1 4', '2'], ['Basic 2', '5\n2 3 0 1 4', '2']]
    },
    {
      re: /minimum number of platforms/i,
      input: 'First line n. Second line: n arrival times. Third line: n departure times.', output: 'Print the minimum number of platforms needed so no train waits.',
      tests: [['Basic', '6\n900 940 950 1100 1500 1800\n910 1200 1120 1130 1900 2000', '3'], ['No overlap', '2\n900 1000\n930 1030', '1']]
    },
    {
      re: /job sequencing problem/i,
      input: 'First line n. Second line: n deadlines. Third line: n profits (job i has deadline[i] and profit[i]; each job takes one unit of time and must finish by its deadline).', output: 'Print the count of jobs scheduled and the maximum total profit, separated by a space.',
      tests: [t('Basic', '4\n4 1 1 1\n20 10 40 30', '2 60'), t('Basic 2', '4\n2 1 2 1\n100 19 27 25', '2 127')]
    },
    {
      re: /^candy$/i,
      input: 'First line n. Second line: n children’s ratings.', output: 'Print the minimum total candies needed so each child gets at least one and any child with a higher rating than an adjacent child gets more candies than that neighbor.',
      tests: [['Basic', '3\n1 0 2', '5'], ['Basic 2', '3\n1 2 2', '4']]
    },
    {
      re: /shortest job first/i,
      input: 'First line n. Second line: n burst times (all arrive at time 0, non-preemptive shortest-job-first order).', output: 'Print the total waiting time across all processes.',
      tests: [['Basic', '4\n6 8 7 3', '28'], ['Basic 2', '3\n4 3 7', '10']]
    },
    {
      re: /insert interval/i,
      input: 'First line n. Next n lines: existing non-overlapping intervals sorted by start, as "start end". Last line: the new interval to insert, as "start end".', output: 'Print the resulting merged, sorted intervals, one "start end" pair per line.',
      tests: [['Basic', '2\n1 3\n6 9\n2 5', '1 5\n6 9', 'exact', false], ['Merges multiple', '5\n1 2\n3 5\n6 7\n8 10\n12 16\n4 8', '1 2\n3 10\n12 16']]
    },
    {
      re: /^merge intervals$/i,
      input: 'First line n. Next n lines: two integers, the start and end of each interval.', output: 'Print the merged non-overlapping intervals sorted by start, one "start end" pair per line.',
      tests: [['Basic', '4\n1 3\n2 6\n8 10\n15 18', '1 6\n8 10\n15 18', 'exact', false], ['No overlap', '2\n1 2\n3 4', '1 2\n3 4']]
    },
    {
      re: /non-overlapping intervals/i,
      input: 'First line n. Next n lines: two integers, the start and end of each interval.', output: 'Print the minimum number of intervals to remove so the rest do not overlap.',
      tests: [['Basic', '4\n1 2\n2 3\n3 4\n1 3', '1'], ['No overlap', '2\n1 2\n2 3', '0']]
    },
    {
      re: /insertion at the head of linked list|insert node before head in doubly linked list/i,
      input: 'First line n. Second line: n integers (the list, head to tail). Third line: the value to insert at the head.', output: 'Print the resulting list, head to tail, separated by spaces.',
      tests: [t('Basic', '3\n2 3 4\n1', '1 2 3 4'), t('Empty list', '0\n\n5', '5')]
    },
    {
      re: /deletion of the head of ll|delete head of doubly linked list/i,
      input: 'First line n. Second line: n integers (the list, head to tail; n >= 1).', output: 'Print the list after removing its head, head to tail, separated by spaces. Print an empty line if the result is empty.',
      tests: [t('Basic', '3\n1 2 3', '2 3'), t('Single node', '1\n5', '')]
    },
    {
      re: /find the length of the linked list/i,
      input: 'First line n. Second line: n integers (the list).', output: 'Print the number of nodes.',
      tests: [['Basic', '4\n1 2 3 4', '4'], ['Empty', '0\n', '0']]
    },
    {
      re: /^search in linked list$/i,
      input: 'First line n. Second line: n integers (the list). Third line: the target value.', output: 'Print true if the target is present, otherwise false.',
      tests: [b('Found', '3\n1 2 3\n2', 'true'), b('Not found', '3\n1 2 3\n9', 'false')]
    },
    {
      re: /reverse a doubly linked list/i,
      input: 'First line n. Second line: n integers (the list, head to tail).', output: 'Print the list reversed, separated by spaces.',
      tests: [t('Basic', '5\n1 2 3 4 5', '5 4 3 2 1'), t('Single node', '1\n9', '9')]
    },
    {
      re: /middle of a linkedlist/i,
      input: 'First line n. Second line: n integers (the list, n >= 1). For an even-length list, the second of the two middle nodes is the answer.', output: 'Print the middle node’s value.',
      tests: [['Odd length', '5\n1 2 3 4 5', '3'], ['Even length', '6\n1 2 3 4 5 6', '4']]
    },
    {
      re: /reverse a linkedlist|^reverse a ll$/i,
      input: 'First line n. Second line: n integers (the list, head to tail).', output: 'Print the list reversed, separated by spaces.',
      tests: [t('Basic', '5\n1 2 3 4 5', '5 4 3 2 1'), t('Single node', '1\n9', '9')]
    },
    {
      re: /detect a loop in ll/i,
      input: 'First line n. Second line: n integers (the list, head to tail). Third line: pos, the zero-based index the tail connects back to (-1 for no loop).', output: 'Print true if the list has a loop, otherwise false.',
      tests: [b('Has loop', '4\n3 2 0 -4\n1', 'true'), b('No loop', '3\n1 2 3\n-1', 'false')]
    },
    {
      re: /starting point in ll/i,
      input: 'First line n. Second line: n integers (the list, head to tail). Third line: pos, the zero-based index the tail connects back to (-1 for no loop).', output: 'Print the value at the loop’s starting node, or -1 if there is no loop.',
      tests: [['Has loop', '4\n3 2 0 -4\n1', '2'], ['No loop', '3\n1 2 3\n-1', '-1']]
    },
    {
      re: /length of loop in ll/i,
      input: 'First line n. Second line: n integers (the list, head to tail). Third line: pos, the zero-based index the tail connects back to (-1 for no loop).', output: 'Print the number of nodes in the loop, or 0 if there is no loop.',
      tests: [['Has loop', '4\n3 2 0 -4\n1', '3'], ['No loop', '3\n1 2 3\n-1', '0']]
    },
    {
      re: /ll is palindrome/i,
      input: 'First line n. Second line: n integers (the list, head to tail).', output: 'Print true if the sequence reads the same forward and backward, otherwise false.',
      tests: [b('Palindrome', '4\n1 2 2 1', 'true'), b('Not palindrome', '3\n1 2 3', 'false')]
    },
    {
      re: /segregate odd and even nodes/i,
      input: 'First line n. Second line: n integers (the list, head to tail).', output: 'Print all nodes at odd 1-indexed positions (1st, 3rd, 5th, ...) in original relative order, followed by all nodes at even positions in original relative order, separated by spaces.',
      tests: [t('Basic', '5\n1 2 3 4 5', '1 3 5 2 4'), t('Even count', '7\n2 1 3 5 6 4 7', '2 3 6 7 1 5 4')]
    },
    {
      re: /nth node from the back/i,
      input: 'First line n. Second line: n integers (the list). Third line: k (1-indexed position from the back to remove).', output: 'Print the resulting list, separated by spaces.',
      tests: [t('Basic', '5\n1 2 3 4 5\n2', '1 2 3 5'), t('Removes head', '3\n1 2 3\n3', '2 3')]
    },
    {
      re: /delete the middle node in ll/i,
      input: 'First line n. Second line: n integers (the list, n >= 1). The middle is the node at zero-based index floor(n/2).', output: 'Print the resulting list, separated by spaces.',
      tests: [t('Odd length', '5\n1 2 3 4 5', '1 2 4 5'), t('Even length', '6\n2 1 7 4 5 6', '2 1 7 5 6')]
    },
    {
      re: /^sort ll$/i,
      input: 'First line n. Second line: n integers (the list).', output: 'Print the list sorted ascending, separated by spaces.',
      tests: [t('Basic', '4\n4 2 1 3', '1 2 3 4'), t('Already sorted', '3\n1 2 3', '1 2 3')]
    },
    {
      re: /intersection point of y ll/i,
      input: 'First line n1. Second line: n1 integers (list A, head to tail). Third line n2. Fourth line: n2 integers (list B). Fifth line: two integers skipA skipB — by construction, a[skipA..] equals b[skipB..] (the shared tail).', output: 'Print the value at the intersection node.',
      tests: [['Basic', '5\n4 1 8 4 5\n6\n5 6 1 8 4 5\n2 3', '8'], ['Single node overlap', '4\n1 2 3 9\n2\n4 9\n3 1', '9']]
    },
    {
      re: /add one to a number represented by ll/i,
      input: 'First line n. Second line: n digits, most significant first (the list).', output: 'Print the digits of (the number + 1), most significant first, separated by spaces.',
      tests: [t('Basic', '3\n1 2 3', '1 2 4'), t('Carries into a new digit', '3\n9 9 9', '1 0 0 0')]
    },
    {
      re: /add two numbers in linked list/i,
      input: 'First line n1. Second line: n1 digits, most significant first (list A). Third line n2. Fourth line: n2 digits, most significant first (list B).', output: 'Print the digits of (A + B), most significant first, separated by spaces.',
      tests: [t('Basic', '3\n3 4 2\n3\n4 6 5', '8 0 7'), t('Different lengths', '2\n9 9\n1\n1', '1 0 0')]
    },
    {
      re: /delete all occurrences of a key in dll/i,
      input: 'First line n. Second line: n integers (the list). Third line: the key to remove.', output: 'Print the resulting list with every occurrence of the key removed, separated by spaces. Print an empty line if the result is empty.',
      tests: [t('Basic', '6\n1 2 3 2 4 2\n2', '1 3 4'), t('Key absent', '3\n1 2 3\n9', '1 2 3')]
    },
    {
      re: /pairs with given sum in doubly linked list/i,
      input: 'First line n. Second line: n integers sorted ascending (the list). Third line: target sum.', output: 'Print every pair (using each node at most once, found by moving inward from both ends) summing to target: one "a b" pair per line with a < b, ordered by increasing a. Print nothing if none exist.',
      tests: [['Basic', '7\n1 2 4 5 6 8 9\n7', '1 6\n2 5', 'exact', false], ['No pairs', '3\n1 2 3\n100', '']]
    },
    {
      re: /remove duplicates from sorted dll/i,
      input: 'First line n. Second line: n integers sorted ascending (the list).', output: 'Print the list with consecutive duplicates removed, separated by spaces.',
      tests: [t('Basic', '5\n1 1 2 3 3', '1 2 3'), t('No duplicates', '3\n1 2 3', '1 2 3')]
    },
    {
      re: /reverse ll in group of given size k/i,
      input: 'First line n. Second line: n integers (the list). Third line: k.', output: 'Print the list with every complete group of k nodes reversed in place; a trailing group with fewer than k nodes is left unreversed. Separate values with spaces.',
      tests: [t('Basic', '5\n1 2 3 4 5\n2', '2 1 4 3 5'), t('Exact groups', '6\n1 2 3 4 5 6\n3', '3 2 1 6 5 4'), t('Leftover group', '5\n1 2 3 4 5\n3', '3 2 1 4 5')]
    },
    {
      re: /^rotate a ll$/i,
      input: 'First line n. Second line: n integers (the list). Third line: k (right rotation amount).', output: 'Print the list after right-rotating it by k positions, separated by spaces.',
      tests: [t('Basic', '5\n1 2 3 4 5\n2', '4 5 1 2 3'), t('K equals n', '3\n1 2 3\n3', '1 2 3')]
    }
  ];

  function b(name, stdin, expected) { return [name, stdin, expected, 'boolean']; }
  function t(name, stdin, expected) { return [name, stdin, expected, 'tokens']; }
  function u(name, stdin, expected) { return [name, stdin, expected, 'unorderedTokens']; }

  function toTest(row, index) {
    const [name, stdin, expected, compare] = row;
    return { name, stdin, expected, compare: compare || 'exact', hidden: index > 0 };
  }

  function find(problem) {
    return suites.find((suite) => suite.re.test(problem?.title || '')) || null;
  }

  function attach(problem) {
    const suite = find(problem);
    if (!suite) return problem;
    return {
      ...problem,
      inputFormat: suite.input,
      outputFormat: suite.output,
      tests: suite.tests.map(toTest),
      validationCoverage: 'curated',
      judgeNote: `Validated local contract with ${suite.tests.length} cases.`
    };
  }

  function audit() {
    const issues = [];
    for (const suite of suites) {
      if (!(suite.re instanceof RegExp)) issues.push('suite missing RegExp');
      if (!suite.input || !suite.output) issues.push(`${suite.re}: missing contract`);
      if (!Array.isArray(suite.tests) || suite.tests.length < 2) issues.push(`${suite.re}: fewer than two tests`);
      for (const test of suite.tests || []) {
        if (!Array.isArray(test) || test.length < 3) issues.push(`${suite.re}: malformed test`);
        if (typeof test?.[1] !== 'string' || typeof test?.[2] !== 'string') issues.push(`${suite.re}: input/expected must be strings`);
      }
    }
    return { suiteCount: suites.length, testCount: suites.reduce((n, s) => n + s.tests.length, 0), issues };
  }

  const originalEnrich = window.ProblemEngine?.enrich;
  if (originalEnrich) {
    window.ProblemEngine.enrich = function enhancedEnrich(problem) {
      return attach(originalEnrich(problem));
    };
  }

  window.JudgeCases = { find, attach, audit };
})();
