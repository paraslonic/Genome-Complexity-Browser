import app.gene_graph.source.compute_complexity as compute_complexity
import numpy as np


def reverse(edge_table, length_table):

	graph = compute_complexity.generate_graph(edge_table)
	refs = [stamm for stamm in graph]
	refs.sort()

	all_contigs = []

	for stamm in graph:
		for contig in graph[stamm]:
			all_contigs.append(contig + [stamm, graph[stamm].index(contig)])

	all_contigs.sort(key=len, reverse=True)

	print('Reversing...\n')	
	was_reversed = 0

	aligned = []

	while True:
		for contig in all_contigs:
			if contig in aligned:
				continue
			reference = contig[-2]
			aligned.append(contig)
			break

		print('reference is ' + contig[-2] + ' contig_' + str(contig[-1]))

		FORWARD = 0
		REVERSE = 0

		was_done = 0

		ref_pair_chain = set([contig[i] + contig[i + 1] for i in range(int(len(contig)-3))])

		for contig2 in all_contigs:
			if contig2 in aligned or contig2[-2] == reference:
				continue

			if len(set(contig2[:-2]).intersection(set(contig[:-2]))) < 0.5 * len(set(contig2[:-2])):
				continue

			pair_chain = set([contig2[i] + contig2[i + 1] for i in range(int(len(contig2)-3))])						
			reversed_pair_chain = set([contig2[i + 1] + contig2[i] for i in range(int(len(contig2)-3))])

			intersect = ref_pair_chain.intersection(pair_chain)
			forw_count = np.sum([length_table[contig[-2]][OG[:int(len(OG)/2)]] for OG in intersect])


			rev_intersect = ref_pair_chain.intersection(reversed_pair_chain)
			rev_count = np.sum([length_table[contig2[-2]][OG[:int(len(OG)/2)]] for OG in rev_intersect])


			if rev_count > forw_count:
				was_done += 1
				REVERSE += 1
				graph[contig2[-2]][contig2[-1]].reverse()

			elif forw_count >= rev_count:
				was_done += 1
				FORWARD += 1
			
			aligned.append(contig2)
		if was_done == 0:
			break



		print('FORWARD: ' + str(FORWARD))
		print('REVERSE: ' + str(REVERSE))
		print()

	print('FORWARD: ' + str(FORWARD))
	print('REVERSE: ' + str(REVERSE))
	print()
	print('Reversing completed!')

	return graph

