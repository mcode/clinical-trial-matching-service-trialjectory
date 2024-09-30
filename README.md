# clinical-trial-matching-service-trialjectory

Wrapper for sending queries to the [TrialJectory](https://www.trialjectory.com/) clinical trial search service.

For more information on the architecture and data schemas of the clinical trial matching system, please visit the [clinical-trial-matching-app wiki](https://github.com/mcode/clinical-trial-matching-app/wiki).

## Configuration:

Open `.env` and make sure the configruation matches your environment. If it does not, create a copy called `.env.local` to override the `.env` file with your local changes.

# Running the Server
1. Run `npm install`
2. Run `npm start`
3. The service will now be running at http://localhost:3001/
