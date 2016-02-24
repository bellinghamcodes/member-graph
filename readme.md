## [View the graph!](http://hackbellingham.github.io/member-graph/)

# What is it?

This is a partial graph of the members of the [Hack Bellingham](http://hackbellingham.com/) group.

The high-level steps involved in creating this visualization:

1. Dump user data from Slack. See https://api.slack.com/methods/users.list/test for an example of how to do this.
2. Copy this D3 example https://bl.ocks.org/mbostock/4062045.
3. Replace Les Misérables data with Hack Bellingham members.

This visualization is incomplete. Please feel free to submit PRs to add more connections or otherwise improve the visualization.

# Set up
1. `clone` the repo
2. `cd` to the cloned repo
3. `npm install`

# To run locally
1. `npm run start`

# To add connections
1. Modify `data/links.txt` to include your username and the list of users you know. See `data/users.json` to get the correct name values.
2. `node ./scripts/process-links`
3. Run locally and preview the results

PRs welcome!
