echo $1
java -classpath $1/liresolr/dist/lire-request-handler.jar net.semanticmetadata.lire.solr.ParallelSolrIndexer -i $1/images/infile.txt -o $1/images/outfile.xml
curl http://localhost:8983/solr/images/update?wt=json -H "Content-Type: text/xml" --data-binary @$1/images/outfile.xml
curl http://localhost:8983/solr/images/update?wt=json -H "Content-Type: text/xml" --data-binary "<commit />"
rm $1/images/outfile.xml
rm $1/images/infile.txt
echo "images indexed successfully"
