import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


    function validateLink(url: string) {
        return url.match(/\.(png|jpg|gif|jpeg)$/) != null;
    }
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT

    // filtered image endpoint
    app.get("/filteredimage", async (req: Request, res: Response) => {
        let url = req.query.image_url as string;
        let newUrl = validateLink(url);

        if (newUrl) {
            const path: string = await filterImageFromURL(url);

            res.status(200).sendFile(path, function (error) {
                if (error) {
                    res.status(422).send("image is not accessible");
                } else {
                    deleteLocalFiles([path]);
                }
            });
        }
        else {
            res.status(404).send("url is not valid")
        }
    });
  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();