function draw_overview(data, graph_el_id) {
    var traversals = [];
    data.crawlers.forEach(function (crawler, index) {
        // console.log(crawler);
        var all_traversals = crawler.traversals || [];
        all_traversals.forEach(function (traversal, trav_index) {

            traversals.push({
                "crawler_id": crawler.crawler_id,
                "parser_name": traversal[traversal.traversal_type].parser_name,
                "traversal_type": traversal.traversal_type
            })
        })
    });
    console.log("traversals", traversals);

    var crawlers_children = [];
    data.crawlers.forEach(function (crawler, index) {
        // console.log(crawler);
        var crawler_data = {};
        crawler_data['node'] = "crawler:" + crawler.crawler_id;
        crawler_data['nodeName'] = crawler.crawler_id;
        crawler_data['type'] = "crawler";
        // crawler_data['direction'] = "ASYN";

        var children = [];
        crawler.parsers.forEach(function (parser, praser_index) {
            // console.log("parser", parser);
            var parser_data = {};
            parser_data['node'] = "parser:" + parser.parser_name;
            parser_data['nodeName'] = parser.parser_name;
            parser_data['type'] = "parser";
            // parser_data["link"] = {
            //     "name": "amazon_product_search_in_bing",
            //     "direction": "SYNC"
            // };
            var has_pagination = check_pagination_traversal(traversals, parser.parser_name, crawler.crawler_id);
            // console.log("has_pagination", has_pagination);
            if (has_pagination) {
                parser_data["link"] = {
                    "name": has_pagination.parser_name,
                    "direction": "SYNC"
                };
            }
            // console.log("===", parser_data);
            var parser_children = [];
            var data_selectors = parser.data_selectors || [];
            data_selectors.forEach(function (selector, selector_index) {
                var selector_data = {};
                selector_data['node'] = "field:" + selector.selector_id;
                selector_data['nodeName'] = selector.selector_id;
                selector_data['type'] = "field";
                // console.log("===", selector_data);
                // selector_data['direction'] = "ASYN";

                var selector_children = [];
                if (selector.selector_attribute === "element") {
                    selector.child_selectors.forEach(function (selector, selector_index) {

                        var selector_child_data = {};
                        selector_child_data['node'] = "field:" + selector.selector_id;
                        selector_child_data['nodeName'] = selector.selector_id;
                        selector_child_data['type'] = "field";
                        selector_children.push(selector_child_data);
                    })
                }
                selector_data['children'] = selector_children;
                parser_children.push(selector_data);

            });
            parser_data['children'] = parser_children;
            children.push(parser_data);

        });
        crawler_data['children'] = children;
        // console.log(crawler_data);

        crawlers_children.push(crawler_data)
    });
    // console.log(crawlers_children);
    var final_data = {
        "node": "start",
        "direction": "SYNC",
        "nodeName": "start",
        "type": "start",
        'children': crawlers_children
    };
    console.log("final_data", final_data);
    drawOverviewTree( final_data, graph_el_id);
}