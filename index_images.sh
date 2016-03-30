java -classpath ~/liresolr/dist/lire-request-handler.jar net.semanticmetadata.lire.solr.ParallelSolrIndexer -i /tmp/infile.txt -o /tmp/outfile.xml
curl http://localhost:8983/solr/images/update?wt=json -H "Content-Type: text/xml" --data-binary @/tmp/outfile.xml
curl http://localhost:8983/solr/images/update?wt=json -H "Content-Type: text/xml" --data-binary "<commit />"
rm /tmp/outfile.xml
rm /tmp/infile.txt
echo "images indexed successfully"
