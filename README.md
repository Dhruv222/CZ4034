# InfoRetriever

This application index tweets from various Twitter handles and makes them searchable using the Apache Solr library.

The front end is built using Twitter Bootstrap and JQuery while the back end is coded using [Node.js](https://nodejs.org/)

###Setup instructions

After cloning the repo, run the following command:
```
npm install
```

This will install all the requisite `Node.js` dependencies.

In the cloned repo you will a `solr-5.5.0` directory. This has `Solr` set up with configuration files and schema files for two cores, namely `tweets` and `images`. You should run your `Solr` instance from this directory or use the configuration files (`solrconfig.xml` and `schema.xml`) from this directory.

This application also utilises the [LIRE Plugin for Solr](https://bitbucket.org/dermotte/liresolr) in order to support image search. All the necessary files are included in the `liresolr` directory of the repo. The `solr-5.5.0` directory is already preconfigured to work with this `liresolr` directory. The plugin will be automatically called from this directory by the application while indexing and searching images.

Finally, a `.env` file is required for this application to run. This `.env` file is supposed to contain Twitter API credentials which will be used by the application to fetch the tweets. Refer to the `.env.sample` to understand the format of the `.env ` file. After cloning the repo, create a `.env` file under the root of the application and populate according to the `.env.sample` file.

```
Note:
The 'images' folder is the one that will store and serve the image files when tweets are fetched and indexed.
```

```
Note:
The application assumes that your Solr instance runs on host 'localhost' and port '8983'. In order to change this default configuration, the file 'lib/solr.js' will need to be changed.
```

The above steps should be sufficient to get the user up and running with this application.

### Running the application

First, start your `Solr` instance using the following command:
```
<path_to_repo>/solr-5.5.0/bin/solr restart
```

Next, start the node server:
```
node <path_to_repo>/index.js
```

Go to `http://localhost:3001` on your browser. The application should be visible at this URL.
