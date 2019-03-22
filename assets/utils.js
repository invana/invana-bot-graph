function check_pagination_traversal(traversals, parser_name, crawler_id) {
    // console.log("========", traversals, parser_name, crawler_id);
    for (var index in traversals) {
        var traversal = traversals[index];
        // console.log("**",traversal.traversal_type);
        if (traversal.traversal_type === "pagination") {
            // console.log("======>======>", traversal, parser_name, crawler_id);

            if (traversal.parser_name === parser_name && traversal.crawler_id === crawler_id) {
                // console.log("======== ok", traversal);
                var d = {"parser_name": parser_name, "crawler_id": crawler_id};
                return d;
                break

            }
        }
    }
}

function get_all_crawlers(crawlers) {
    var all_crawlers = [];

    crawlers.forEach(function (crawler, index) {
        // console.log(crawler);

        // crawler.traversals.forEach(function (traversal, trav_index) {
        //
        //     traversals.push({
        //         "crawler_id": crawler.crawler_id,
        //         "parser_name": traversal[traversal.traversal_type].parser_name,
        //         "traversal_type": traversal.traversal_type,
        //         "traversal_data": traversal
        //     })
        // });
        all_crawlers.push(crawler);
    });
    return all_crawlers;

}

//
// function check_traversal(traversals, parser_name, crawler_id) {
//     // console.log("========", traversals, parser_name, crawler_id);
//     for (var index in traversals) {
//         var traversal = traversals[index];
//         if (traversal.parser_name === parser_name && traversal.crawler_id === crawler_id) {
//             // console.log("======== ok", traversal);
//             var d = {"parser_name": parser_name, "crawler_id": crawler_id, "traversal": traversal};
//             return d;
//             break
//
//         }
//
//     }
// }


function get_crawler_by_id(crawlers, crawler_id) {
    for (var i in crawlers) {
        var crawler = crawlers[i];
        if (crawler.crawler_id === crawler_id) {
            return crawler;
        }
    }
    return null;
}

//
// function get_field_traversal_data(crawler_id) {
//     var crawler = get_crawler_by_id(crawlers, crawler_id)
//     return get_children_for_crawler()
// }

function get_children_for_crawler_from_field(selector, context) {
    // console.log(selector);
    var selector_data = {};
    selector_data['node'] = "field:" + selector.selector_id;
    selector_data['nodeName'] = selector.selector_id;
    selector_data['type'] = "field";
    var selector_children = [];

    if (selector.selector_attribute === "element") {
        selector.child_selectors.forEach(function (child_selector, selector_index) {
            var selector_child_data = get_children_for_crawler_from_field(child_selector, context);
            selector_children.push(selector_child_data);
        });

    }

    if (selector.traversals) {
        console.log("======", selector.traversals);
        var crawlers = get_all_crawlers(context.crawlers);
        selector.traversals.forEach(function (traversal, index) {
            // console.log(traversal);

            var crawler = get_crawler_by_id(crawlers, traversal.crawler_id);
            console.log("crawler", crawler, typeof crawler);
            // var crawler_children = get_children_for_crawler(crawler, context);
            // console.log("crawler_children", crawler_children);
            // crawler_children.forEach(function (crawler_child, ii) {
            //     selector_children.push(crawler_child);
            // })
            var child_crawler_traveral = get_crawler_traversal(crawler, context);
            selector_children.push(child_crawler_traveral);

            // selector_children = selector_children + crawler_children;

        });

    }
    // if (    )

    // console.log("selector_children", selector_children);
    selector_data['children'] = selector_children;

    return selector_data;
}

function get_children_for_parser(parser, context) {


    var parser_children = [];


    var data_selectors = parser.data_selectors || [];
    if (parser.parser_type === "PaginationExtractor") {
        // parser_children.push({
        //     "node": parser.parser_name,
        //     "nodeName": parser.parser_name,
        //     "type": "crawler"
        // });

    } else {
        data_selectors.forEach(function (selector, selector_index) {
            var selector_data = get_children_for_crawler_from_field(selector, context)
            parser_children.push(selector_data);

        });

    }
    return parser_children;
}


function get_parser_traversal(parser, context) {
    var parser_data = {};
    parser_data['node'] = "parser:" + parser.parser_name;
    parser_data['nodeName'] = parser.parser_name;
    parser_data['type'] = "parser";
    parser_data['children'] = get_children_for_parser(parser, context);
    if (parser['parser_type'] === "PaginationExtractor") {

        parser_data["link"] = {
            "name": parser.parser_name,
            "direction": "SYNC"
        };
    }
    return parser_data;
}

function get_children_for_crawler(crawler, context) {

    var children = [];
    crawler.parsers.forEach(function (parser, praser_index) {
        // console.log("parser", parser);
        var parser_data = get_parser_traversal(parser, context)
        children.push(parser_data);

    });
    // console.log(crawler_data);


    return children;
}

function update_crawler_traversed_info(current_crawler, context) {

    var current_crawler_id = current_crawler.crawler_id;
    context.crawlers.forEach(function (crawler, index) {
        if (crawler.crawler_id === current_crawler_id) {
            crawler.has_traversed = true;
        }
    });
    console.log("crawler", context);
    return context;
}

function get_crawler_traversal(crawler, context) {


    var crawler_data = {
        "node": crawler.crawler_id,
        "nodeName": crawler.crawler_id,
        "type": "crawler",
        'children': get_children_for_crawler(crawler, update_crawler_traversed_info(crawler, context))
    };
    return crawler_data
}